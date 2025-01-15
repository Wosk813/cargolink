'use server';

import { createSession, deleteSession } from './session';
import { redirect } from '@/src/i18n/routing';
import { neon } from '@neondatabase/serverless';
import {
  AccountType,
  Address,
  Company,
  Contract,
  GoodDetails,
  GoodsCategory,
  PersonDetails,
  Post,
  PostTypes,
  RoadDetails,
  RowMapping,
} from '@/src/app/lib/definitions';
import bcrypt from 'bcrypt';
import {
  FilterProps,
  SignupFormData,
  SortDirection,
  ValidationErrors,
  AnnouncementProps,
  User,
  newAnnouncementSchema,
  NewAnnouncementFormState,
  ErrandProps,
  newErrandSchema,
  NewErrandFormState,
  ChatType,
  ChatMessage,
  Opinion,
} from '@/src/app/lib/definitions';
import { getTranslations } from 'next-intl/server';
import { verifySession } from './dal';
import { dbRowToObject, filterOptionsToSQL, sortDirectionToSQL, verifyPassword } from './utilis';

const sql = neon(
  `postgres://neondb_owner:zZD3Rg6YXVMn@ep-soft-firefly-a2gmv5of-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require`,
);

export async function handleLogin(state: { errors: string } | undefined, formData: FormData) {
  const credentialsErrors = await checkCredentials(
    formData.get('email') as string,
    formData.get('password') as string,
  );
  if (credentialsErrors?.errors) {
    return { errors: credentialsErrors.errors };
  }
  const user = await getUserByEmail(formData.get('email') as string);
  await createSession(user['user_id'], user['role'], user['account_type']);
  redirect({ href: '/announcements', locale: 'pl' });
}

export async function logout() {
  await deleteSession();
  redirect({ href: '/auth/login', locale: 'pl' });
}

export async function register(formData: SignupFormData) {
  if (!formData || !formData.password) {
    return;
  }

  const hashedPassword = await bcrypt.hash(formData.password, 10);
  const { firstname, lastname, email, password, accountType, company, languages } = formData;
  if (formData.asCompany && formData.company) {
    const address_id = await addAddress(formData.company.address);

    const companyId = await sql(
      'INSERT INTO companies (name, taxId, address_id) VALUES ($1, $2, $3) RETURNING company_id',
      [company.companyName, company.taxId, address_id],
    );

    await sql(
      'INSERT INTO users (first_name, last_name, email, password, account_type, company_id, languages, is_phisical_person) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        firstname,
        lastname,
        email,
        hashedPassword,
        accountType,
        companyId[0]['company_id'],
        languages,
        false,
      ],
    );
  } else {
    await sql(
      'INSERT INTO users (first_name, last_name, email, password, account_type, company_id, languages, is_phisical_person) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [firstname, lastname, email, hashedPassword, accountType, null, languages, true],
    );
  }
  const user = await sql('SELECT * FROM users WHERE email = $1', [email]);
  await createSession(user[0]['user_id'], user[0]['role'], user[0]['account_type']);
  redirect({ href: '/', locale: 'pl' });
}

export async function checkIfUserExists(formData: SignupFormData): Promise<ValidationErrors> {
  const t = await getTranslations('signup');

  const errors: ValidationErrors = {};
  const results = await sql('SELECT * FROM users WHERE email = $1', [formData.email]);

  errors.email = results.length > 0 ? t('emailIsUsed') : '';

  return errors;
}

export async function checkCredentials(
  email: string,
  password: string,
): Promise<{ errors: string } | undefined> {
  const t = await getTranslations('login');

  const results = await sql('SELECT * FROM users WHERE email = $1', [email]);

  if (results.length === 0) {
    return {
      errors: t('credentialsError'),
    };
  }

  const user = results[0];
  const hashedPassword = user.password;

  const isPasswordValid = await verifyPassword(password, hashedPassword);

  if (!isPasswordValid) {
    return {
      errors: t('credentialsError'),
    };
  }

  return undefined;
}

export async function getUserById(userId: string): Promise<User> {
  const user = await sql(
    'SELECT u.*, COALESCE((SELECT COUNT(*) FROM announcements a WHERE a.author_id = u.user_id), (SELECT COUNT(*) FROM errands e WHERE e.author_id = u.user_id)) AS posts_count FROM users u WHERE u.user_id = $1;',
    [userId],
  );
  return dbRowToObject(user[0], RowMapping.User) as User;
}

export async function getUserByEmail(email: string) {
  const user = await sql('SELECT * FROM users WHERE email = $1', [email]);
  return user[0];
}

export async function getAnnouncements(
  sortBy: SortDirection = SortDirection.ByNewest,
  filterOptions: FilterProps,
) {
  let sqlString = `
    SELECT announcements.*, a1.country_id as from_country_id, a1.state_id as from_state_id, a1.city_id as from_city_id, a1.country_name as from_country_name, a1.country_iso2 as from_country_iso2, a1.city_name as from_city, a2.country_id as to_country_id, a2.state_id as to_state_id, a2.city_id as to_city_id, a2.country_name as to_country_name, a2.country_iso2 as to_country_iso2, a2.city_name as to_city, ST_X(a1.geography::geometry) as from_longitude, ST_Y(a1.geography::geometry) as from_latitude, ST_X(a2.geography::geometry) as to_longitude, ST_Y(a2.geography::geometry) as to_latitude FROM announcements LEFT JOIN addresses a1 ON announcements.from_address_id = a1.address_id LEFT JOIN addresses a2 ON announcements.to_address_id = a2.address_id
    ${filterOptionsToSQL(filterOptions)} 
    ${sortDirectionToSQL(sortBy)}
  `;

  const dbrows = await sql(sqlString);
  const announcements: Array<AnnouncementProps | null> = [];

  dbrows.map((dbrow) => {
    if (!dbrow['is_accepted']) return;
    let row: AnnouncementProps | null = dbRowToObject(
      dbrow,
      RowMapping.AnnoucementProps,
    ) as AnnouncementProps;
    announcements.push(row);
  });

  return announcements;
}

export async function getErrands(
  sortBy: SortDirection = SortDirection.ByNewest,
  filterOptions: FilterProps,
) {
  let sqlString = `
    SELECT
      errands.*, g.*, g.name as good_name, gc.name as good_category,
      a1.country_id as from_country_id,
      a1.state_id as from_state_id,
      a1.city_id as from_city_id,
      a1.country_name as from_country_name,
      a1.country_iso2 as from_country_iso2,
      a1.city_name as from_city,

      a2.country_id as to_country_id,
      a2.state_id as to_state_id,
      a2.city_id as to_city_id,
      a2.country_name as to_country_name,
      a2.country_iso2 as to_country_iso2,
      a2.city_name as to_city,
        ST_X(a1.geography::geometry) as from_longitude,
      ST_Y(a1.geography::geometry) as from_latitude,
      ST_X(a2.geography::geometry) as to_longitude,
      ST_Y(a2.geography::geometry) as to_latitude
    FROM errands
    LEFT JOIN addresses a1
    ON errands.from_address_id = a1.address_id
    LEFT JOIN addresses a2
    ON errands.to_address_id = a2.address_id
    LEFT JOIN goods g
    ON errands.good_id = g.good_id
    LEFT JOIN goods_categories gc
    ON g.category_id = gc.category_id
  `;

  const dbrows = await sql(sqlString);
  const errands: Array<ErrandProps | null> = [];

  dbrows.map((dbrow) => {
    if (!dbrow['is_accepted']) return;
    let row: ErrandProps | null = dbRowToObject(dbrow, RowMapping.ErrandProps) as ErrandProps;
    errands.push(row);
  });

  return errands;
}

export async function getAnnouncementsById(id: string): Promise<AnnouncementProps | null> {
  const result = await sql`
    SELECT
      announcements.*,
      a1.country_name as from_country_name,
      a1.country_iso2 as from_country_iso2,
      a1.city_name as from_city,
      a2.country_name as to_country_name,
      a2.country_iso2 as to_country_iso2,
      a2.city_name as to_city,
        ST_X(a1.geography::geometry) as from_longitude,
      ST_Y(a1.geography::geometry) as from_latitude,
      ST_X(a2.geography::geometry) as to_longitude,
      ST_Y(a2.geography::geometry) as to_latitude
    FROM announcements
    LEFT JOIN addresses a1
    ON announcements.from_address_id = a1.address_id
    LEFT JOIN addresses a2
    ON announcements.to_address_id = a2.address_id
    WHERE announcements.announcement_id = ${id}
  `;

  if (result.length === 0) return null;

  return dbRowToObject(result[0], RowMapping.AnnoucementProps) as AnnouncementProps;
}

export async function getErrandById(id: string): Promise<ErrandProps | null> {
  const result = await sql`
  SELECT
      errands.*, g.*, g.name as good_name, gc.name as good_category,
      a1.country_id as from_country_id,
      a1.state_id as from_state_id,
      a1.city_id as from_city_id,
      a1.country_name as from_country_name,
      a1.country_iso2 as from_country_iso2,
      a1.city_name as from_city,

      a2.country_id as to_country_id,
      a2.state_id as to_state_id,
      a2.city_id as to_city_id,
      a2.country_name as to_country_name,
      a2.country_iso2 as to_country_iso2,
      a2.city_name as to_city,
        ST_X(a1.geography::geometry) as from_longitude,
      ST_Y(a1.geography::geometry) as from_latitude,
      ST_X(a2.geography::geometry) as to_longitude,
      ST_Y(a2.geography::geometry) as to_latitude
    FROM errands
    LEFT JOIN addresses a1
    ON errands.from_address_id = a1.address_id
    LEFT JOIN addresses a2
    ON errands.to_address_id = a2.address_id
    LEFT JOIN goods g
    ON errands.good_id = g.good_id
    LEFT JOIN goods_categories gc
    ON g.category_id = gc.category_id
    WHERE errands.errand_id = ${id}
  `;

  if (result.length === 0) return null;

  return dbRowToObject(result[0], RowMapping.ErrandProps) as ErrandProps;
}

export async function addAddress(addres: Address): Promise<string> {
  const addresses = await sql(
    'INSERT INTO addresses (country_id, state_id, city_id, city_name, postal_code, street, geography, country_name, country_iso2) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING address_id',
    [
      addres.countryId,
      addres.stateId,
      addres.cityId,
      addres.city,
      addres.postalCode,
      addres.street,
      `POINT(${addres.geography?.coordinates[0]} ${addres.geography?.coordinates[1]})`,
      addres.countryName,
      addres.countryIso2,
    ],
  );
  return addresses[0]['address_id'];
}

export async function addCompany(company: Company): Promise<string> {
  const addressId = await addAddress(company.address);

  const comapnies = await sql(
    'INSERT INTO companies (name, taxId, address_id) VALUES ($1, $2, $3) RETURNING company_id',
    [company.companyName, company.taxId, addressId],
  );
  return comapnies[0]['company_id'];
}

export async function addAnnouncement(state: NewAnnouncementFormState, formData: FormData) {
  const t = await getTranslations('addPost');
  const validatedFields = newAnnouncementSchema(t).safeParse({
    title: formData.get('title'),
    brand: formData.get('brand'),
    model: formData.get('model'),
    maxWeight: formData.get('maxWeight'),
    maxSize: formData.get('maxSize'),
    maxHeight: formData.get('maxHeight'),
    fromCity: formData.get('fromCity'),
    toCity: formData.get('toCity'),
    departureDate: formData.get('departureDate'),
    arrivalDate: formData.get('arrivalDate'),
    desc: formData.get('desc'),
    from: JSON.parse(formData.get('from') as string) as Address,
    to: JSON.parse(formData.get('to') as string) as Address,
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const data = validatedFields.data;
  let [size_x, size_y] = data.maxSize.split('x').map(Number);
  const { userId } = await verifySession();

  const from_address_id = await addAddress(data.from);
  const to_address_id = await addAddress(data.to);

  await sql(
    'INSERT INTO announcements (title, description, start_date, arrive_date, max_weight, size_x, size_y, max_height, author_id, is_accepted, vehicle_brand, vehicle_model, from_address_id, to_address_id, road_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
    [
      data.title,
      data.desc,
      data.departureDate,
      data.arrivalDate,
      data.maxWeight,
      size_x,
      size_y,
      data.maxHeight,
      userId,
      false,
      data.brand,
      data.model,
      from_address_id,
      to_address_id,
      '#' + ((Math.random() * 0xffffff) << 0).toString(16),
    ],
  );
  redirect({ locale: 'pl', href: '/announcements' });
}

export async function addErrand(state: NewErrandFormState, formData: FormData) {
  const t = await getTranslations('addPost');
  const validatedFields = newErrandSchema(t).safeParse({
    title: formData.get('title'),
    wareWeight: formData.get('wareWeight'),
    wareSize: formData.get('wareSize'),
    wareHeight: formData.get('wareHeight'),
    wareName: formData.get('wareName'),
    from: JSON.parse(formData.get('from') as string) as Address,
    to: JSON.parse(formData.get('to') as string) as Address,
    earliestAt: formData.get('earliestAt'),
    latestAt: formData.get('latestAt'),
    desc: formData.get('desc'),
    category: formData.get('wareCategory'),
    specialConditions: formData.get('specialConditions'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;
  let [size_x, size_y] = data.wareSize.split('x').map(Number);
  const { userId } = await verifySession();

  const from_address_id = await addAddress(data.from);
  const to_address_id = await addAddress(data.to);

  const category = await sql('SELECT category_id FROM goods_categories WHERE name=$1', [
    data.category,
  ]);
  const result = await sql(
    'INSERT INTO goods (name, category_id, weight, size_x, size_y, height, special_conditions) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING good_id',
    [
      data.wareName,
      category[0].category_id,
      data.wareWeight,
      size_x,
      size_y,
      data.wareHeight,
      data.specialConditions,
    ],
  );

  const goodId = result[0].good_id;

  await sql(
    'INSERT INTO errands (title, description, earliest_at, latest_at, good_id, author_id, is_accepted, road_color, from_address_id, to_address_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    [
      data.title,
      data.desc,
      data.earliestAt,
      data.latestAt,
      goodId,
      userId,
      false,
      '#' + ((Math.random() * 0xffffff) << 0).toString(16),
      from_address_id,
      to_address_id,
    ],
  );
  redirect({ locale: 'pl', href: '/errands' });
}

export async function updateDescription(user_id: string, desc: string) {
  await sql('UPDATE users SET user_desc = $1 WHERE user_id = $2', [desc, user_id]);
}

export async function searchUsers(state: User[], formData: FormData) {
  let query = 'SELECT * FROM users';
  query += ` WHERE first_name ILIKE '%${formData.get('firstName')}%'`;
  query += ` AND last_name ILIKE '%${formData.get('lastName')}%'`;
  query += ` AND email ILIKE '%${formData.get('email')}%'`;
  query += ` AND account_type = '${formData.get('accountType')}'`;

  const users = await sql(query);
  return users.map((user) => dbRowToObject(user, RowMapping.User) as User);
}

export async function getChats(userId: string): Promise<ChatType[]> {
  let chats: ChatType[] = [];
  const dbChats = await sql(
    "SELECT c.*, COALESCE(ua.user_id, ue.user_id) as post_author_id, COALESCE(ua.languages, ue.languages) as post_author_languages, u.first_name || ' ' || u.last_name as interested_user_name, COALESCE(ua.first_name || ' ' || ua.last_name, ue.first_name || ' ' || ue.last_name ) as post_author_name, u.languages as interested_user_languages, COALESCE(a.title, e.title) as title FROM chats c LEFT JOIN announcements a ON c.announcement_id = a.announcement_id LEFT JOIN errands e ON c.errand_id = e.errand_id LEFT JOIN users ua ON a.author_id = ua.user_id LEFT JOIN users ue ON e.author_id = ue.user_id LEFT JOIN users u ON c.interested_user_id = u.user_id WHERE COALESCE(ua.user_id, ue.user_id) = $1 OR u.user_id = $1",
    [userId],
  );
  await Promise.all(
    dbChats.map(async (dbChat) => {
      let chat: ChatType = dbRowToObject(dbChat, RowMapping.ChatType) as ChatType;
      const dbMessages = await sql('SELECT * FROM messages WHERE chat_id = $1', [
        dbChat['chat_id'],
      ]);

      chat.messages = dbMessages.map(
        (dbMessage) => dbRowToObject(dbMessage, RowMapping.ChatMessage) as ChatMessage,
      );

      chats.push(chat);
    }),
  );

  return chats;
}

export async function getMessages(chatId: string) {
  let messages: ChatMessage[] = [];
  const dbMessages = await sql('SELECT * FROM messages WHERE chat_id = $1', [chatId]);
  dbMessages.map((dbMessage) => {
    messages.push(dbRowToObject(dbMessage, RowMapping.ChatMessage) as ChatMessage);
  });
  return messages;
}

export async function sendMessage(state: any, formData: FormData) {
  const { userId } = await verifySession();
  await sql(
    'INSERT INTO messages (chat_id, sender_id, content, sent_at, readen) VALUES ($1, $2, $3, $4, $5)',
    [formData.get('chatId'), userId, formData.get('message'), new Date(), false],
  );
}

export async function startNewChat(state: any, postId: string) {
  const { userId } = await verifySession();

  const chat = await sql(
    'SELECT * FROM chats WHERE announcement_id = $1 OR errand_id = $1 AND interested_user_id = $2',
    [postId, userId],
  );
  if (chat.length > 0) redirect({ locale: 'pl', href: '/chats' });

  const annoucements = await sql(
    'SELECT announcement_id FROM announcements WHERE announcement_id = $1',
    [postId],
  );
  if (annoucements.length > 0)
    await sql('INSERT INTO chats (announcement_id, interested_user_id) VALUES ($1, $2)', [
      annoucements[0]['announcement_id'],
      userId,
    ]);
  else
    await sql('INSERT INTO chats (errand_id, interested_user_id) VALUES ($1, $2)', [
      postId,
      userId,
    ]);
  redirect({ locale: 'pl', href: '/chats' });
}

export async function setAsReaden(messages: ChatMessage[]) {
  const { userId } = await verifySession();
  messages.map(async (message: ChatMessage) => {
    if (!message.readen && message.senderId != userId)
      await sql('UPDATE messages SET readen = true WHERE message_id = $1', [message.id]);
  });
}

export async function getOpinions(userId: string) {
  let opinions: Opinion[] = [];
  const dbOpinions = await sql(
    'SELECT opinions.*, users.first_name, users.last_name FROM opinions LEFT JOIN users ON opinions.author_id=users.user_id WHERE for_user_id = $1',
    [userId],
  );
  dbOpinions.map((dbOpinion) => {
    opinions.push(dbRowToObject(dbOpinion, RowMapping.Opinion) as Opinion);
  });
  return opinions;
}

export async function getCompanyById(companyId: string): Promise<Company> {
  const companies = await sql(
    'SELECT companies.*, addresses.*, ST_X(addresses.geography::geometry) as longitude, ST_Y(addresses.geography::geometry) as latitude FROM companies INNER JOIN addresses ON companies.address_id = addresses.address_id WHERE companies.company_id = $1',
    [companyId],
  );
  return dbRowToObject(companies[0], RowMapping.Company) as Company;
}

export async function addOpinion(state: any, formData: FormData) {
  const { userId } = await verifySession();

  await sql(
    'INSERT INTO opinions (for_user_id, stars, "desc", author_id) VALUES ($1, $2, $3, $4)',
    [formData.get('forUserId'), formData.get('stars'), formData.get('desc'), userId],
  );
  redirect({ locale: 'pl', href: `/profile/${formData.get('forUserId')}` });
}

export async function getGoodCategoryId(category: GoodsCategory): Promise<string> {
  console.log('category ' + category);
  const categories = await sql('SELECT * FROM goods_categories WHERE name = $1', [category]);
  return categories[0]['category_id'];
}

export async function getPost({
  postId,
  secoundUserId,
}: {
  postId: string;
  secoundUserId: string;
}): Promise<Post | null> {
  let post: Post = { postType: PostTypes.Announcement };
  const { userId } = await verifySession();
  const secoundUser = await getUserById(secoundUserId);
  const currentUser = await getUserById(userId);

  let companies: Record<'carrier' | 'principal', Company> = {
    carrier: {
      companyName: '',
      taxId: '',
      address: {
        countryId: 0,
        stateId: 0,
        cityId: 0,
        countryName: '',
        city: '',
        geography: { coordinates: ['0', '0'] },
        countryIso2: '',
      },
    },
    principal: {
      companyName: '',
      taxId: '',
      address: {
        countryId: 0,
        stateId: 0,
        cityId: 0,
        countryName: '',
        city: '',
        geography: { coordinates: ['0', '0'] },
        countryIso2: '',
      },
    },
  };

  const carrier = currentUser.accountType == AccountType.Carrier ? currentUser : secoundUser;
  const principal = currentUser.accountType == AccountType.Principal ? currentUser : secoundUser;

  if (carrier.companyId) {
    companies.carrier = await getCompanyById(carrier.companyId);
  }
  if (principal.companyId) {
    companies.principal = await getCompanyById(principal.companyId);
  }

  const announcement = await getAnnouncementsById(postId);
  const errand = await getErrandById(postId);

  post.carrier = {
    id: carrier.id!,
    isCompany: !carrier.isPhisicalPerson!,
    companyDetails: companies.carrier,
    personDetails: {
      name: carrier.firstname + ' ' + carrier.lastname,
      address: {
        countryId: 0,
        stateId: 0,
        cityId: 0,
        countryName: '',
        city: '',
        geography: { coordinates: ['0', '0'] },
      },
    },
  };
  post.principal = {
    id: principal.id!,
    isCompany: !principal.isPhisicalPerson!,
    companyDetails: companies.principal,
    personDetails: {
      name: secoundUser.firstname + ' ' + secoundUser.lastname,
      address: {
        countryId: 0,
        stateId: 0,
        cityId: 0,
        countryName: '',
        city: '',
        geography: { coordinates: ['0', '0'] },
      },
    },
  };
  post.goods = {
    category: GoodsCategory.Other,
    name: '',
  };

  if (announcement) {
    post.postType = PostTypes.Announcement;
    post.road = {
      from: announcement.from,
      to: announcement.to,
      departureDate: announcement.departureDate,
      arrivalDate: announcement.arrivalDate,
    };
    return post;
  }
  if (errand) {
    post.postType = PostTypes.Errand;
    post.road = {
      from: errand.from,
      to: errand.to,
      departureDate: errand.earliestAt,
      arrivalDate: errand.latestAt,
    };
    post.goods = {
      category: errand.ware.category,
      name: errand.ware.name,
    };
    return post;
  }
  return null;
}

export async function addContract(state: any, formData: FormData) {
  const { accountType } = await verifySession();

  const carrier: PersonDetails = JSON.parse(formData.get('carrier') as string);
  const principal: PersonDetails = JSON.parse(formData.get('principal') as string);
  const road: RoadDetails = JSON.parse(formData.get('road') as string);
  const good: GoodDetails = JSON.parse(formData.get('good') as string);
  const chatId = formData.get('chatId');

  const fromAddressId = await addAddress(road.from);
  const toAddressId = await addAddress(road.to);

  const carrierCompanyId = carrier.isCompany ? await addCompany(carrier.companyDetails) : null;
  const principalCompanyId = principal.isCompany
    ? await addCompany(principal.companyDetails)
    : null;

  const carrierAddressId = await addAddress(carrier.personDetails.address);
  const prinipalAddressId = await addAddress(principal.personDetails.address);

  const goodCategoryId = await getGoodCategoryId(good.category);

  await sql(
    'INSERT INTO contracts (carrier_id, principal_id, from_address_id, to_address_id, departure_date, arrival_date, carrier_company_id, principal_company_id, carrier_address_id, principal_address_id, carrier_as_company, principal_as_company, good_category_id, good_name, chat_id, accepted_by_carrier, accepted_by_principal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)',
    [
      carrier.id,
      principal.id,
      fromAddressId,
      toAddressId,
      road.departureDate,
      road.arrivalDate,
      carrierCompanyId,
      principalCompanyId,
      carrierAddressId,
      prinipalAddressId,
      carrier.isCompany,
      principal.isCompany,
      goodCategoryId,
      good.name,
      chatId,
      accountType == AccountType.Carrier ? true : false,
      accountType == AccountType.Principal ? true : false
    ],
  );
  redirect({ href: `/chats/${chatId}`, locale: 'pl' });
}

export async function getContractIdForChatId(chatId: string): Promise<string | null> {
  const contracts = await sql(
    'SELECT * FROM contracts WHERE chat_id = $1 ORDER BY created_at LIMIT 1',
    [chatId],
  );
  if (contracts) return contracts[0]['contract_id'];
  return null;
}
