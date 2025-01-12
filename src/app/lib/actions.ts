'use server';

import { createSession, deleteSession } from './session';
import { redirect } from '@/src/i18n/routing';
import { neon } from '@neondatabase/serverless';
import { Post, PostTypes, RowMapping } from '@/src/app/lib/definitions';
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
    const address_id = await sql(
      'INSERT INTO addresses (country_id, state_id, city_id, city_name, postal_code, street, geography, country_name, country_iso2) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING address_id',
      [
        company.address.countryId,
        company.address.stateId,
        company.address.cityId,
        company.address.city,
        company.address.postalCode,
        company.address.street,
        `POINT(${company.address.geography?.coordinates[0]} ${company.address.geography?.coordinates[1]})`,
        company.address.countryName,
        company.address.countryIso2,
      ],
    );

    const companyId = await sql(
      'INSERT INTO companies (name, taxId, address_id) VALUES ($1, $2, $3) RETURNING company_id',
      [company.companyName, company.taxId, address_id[0]['address_id']],
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
    SELECT 
      *,
      ST_X(from_geography::geometry) as from_longitude,
      ST_Y(from_geography::geometry) as from_latitude,
      ST_X(to_geography::geometry) as to_longitude,
      ST_Y(to_geography::geometry) as to_latitude 
    FROM announcements 
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
 SELECT e.*, gc.name as ware_Category, g.name as ware_Name, g.size_x as ware_Size_X, g.size_y as ware_Size_Y, g.height as ware_Height, g.weight as ware_weight, g.special_conditions as ware_Special_Conditions,
  ST_X(e.from_geography::geometry) as from_longitude,
  ST_Y(e.from_geography::geometry) as from_latitude,
  ST_X(e.to_geography::geometry) as to_longitude,
  ST_Y(e.to_geography::geometry) as to_latitude
  FROM errands e
  LEFT JOIN goods g
  ON e.good_id = g.good_id
  LEFT JOIN goods_categories gc
  ON gc.category_id = g.category_id
    ${sortDirectionToSQL(sortBy, 'e.')}
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
      *,
      ST_X(from_geography::geometry) as from_longitude,
      ST_Y(from_geography::geometry) as from_latitude,
      ST_X(to_geography::geometry) as to_longitude,
      ST_Y(to_geography::geometry) as to_latitude
    FROM announcements 
    WHERE announcement_id = ${id}
  `;

  if (result.length === 0) return null;

  return dbRowToObject(result[0], RowMapping.AnnoucementProps) as AnnouncementProps;
}

export async function getErrandById(id: string): Promise<ErrandProps | null> {
  const result = await sql`
  SELECT e.*, gc.name as ware_Category, g.name as ware_Name, g.size_x as ware_Size_X, g.size_y as ware_Size_Y, g.height as ware_Height, g.weight as ware_weight, g.special_conditions as ware_Special_Conditions,
    ST_X(e.from_geography::geometry) as from_longitude,
    ST_Y(e.from_geography::geometry) as from_latitude,
    ST_X(e.to_geography::geometry) as to_longitude,
    ST_Y(e.to_geography::geometry) as to_latitude
    FROM errands e
    LEFT JOIN goods g
    ON e.good_id = g.good_id
    LEFT JOIN goods_categories gc
    ON gc.category_id = g.category_id
    WHERE e.errand_id = ${id}
  `;

  if (result.length === 0) return null;

  return dbRowToObject(result[0], RowMapping.ErrandProps) as ErrandProps;
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
    fromLatitude: formData.get('fromLatitude'),
    fromLongitude: formData.get('fromLongitude'),
    toLatitude: formData.get('toLatitude'),
    toLongitude: formData.get('toLongitude'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const data = validatedFields.data;
  let [size_x, size_y] = data.maxSize.split('x').map(Number);
  const { userId } = await verifySession();
  await sql(
    'INSERT INTO announcements (title, description, start_date, arrive_date, max_weight, size_x, size_y, max_height, author_id, is_accepted, vehicle_brand, vehicle_model, from_geography, to_geography, from_city, to_city, road_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)',
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
      `POINT(${data.fromLatitude} ${data.fromLongitude})`,
      `POINT(${data.toLatitude} ${data.toLongitude})`,
      data.fromCity,
      data.toCity,
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
    fromCity: formData.get('fromCity'),
    toCity: formData.get('toCity'),
    earliestAt: formData.get('earliestAt'),
    latestAt: formData.get('latestAt'),
    desc: formData.get('desc'),
    fromLatitude: formData.get('fromLatitude'),
    fromLongitude: formData.get('fromLongitude'),
    toLatitude: formData.get('toLatitude'),
    toLongitude: formData.get('toLongitude'),
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
    'INSERT INTO errands (title, description, from_geography, to_geography, earliest_at, latest_at, good_id, author_id, is_accepted, from_city, to_city, road_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
    [
      data.title,
      data.desc,
      `POINT(${data.fromLatitude} ${data.fromLongitude})`,
      `POINT(${data.toLatitude} ${data.toLongitude})`,
      data.earliestAt,
      data.latestAt,
      goodId,
      userId,
      false,
      data.fromCity,
      data.toCity,
      '#' + ((Math.random() * 0xffffff) << 0).toString(16),
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

export async function addOpinion(state: any, formData: FormData) {
  const { userId } = await verifySession();

  await sql(
    'INSERT INTO opinions (for_user_id, stars, "desc", author_id) VALUES ($1, $2, $3, $4)',
    [formData.get('forUserId'), formData.get('stars'), formData.get('desc'), userId],
  );
  redirect({ locale: 'pl', href: `/profile/${formData.get('forUserId')}` });
}

// export async function getPost({
//   postId,
//   secoundUserId,
// }: {
//   postId: string;
//   secoundUserId: string;
// }): Promise<Post | null> {
//   let post: Post = { postType: PostTypes.Announcement, road };
//   const annoucements = await sql('SELECT * FROM announcements WHERE announcement_id = $1', [
//     postId,
//   ]);
//   if (annoucements.length > 0) {
//     post.postType = PostTypes.Announcement;
//   } else {
//     const errands = await sql('SELECT * FROM errands WHERE errand_id = $1', [postId]);
//     return dbRowToObject(errands[0], RowMapping.ErrandProps) as ErrandProps;
//   }
//   return null;
// }
