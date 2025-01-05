'use server';

import { createSession, deleteSession } from './session';
import { redirect } from '@/src/i18n/routing';
import { neon } from '@neondatabase/serverless';
import {
  FilterProps,
  GoodsCategory,
  SignupFormData,
  SortDirection,
  ValidationErrors,
  AnnoucementProps,
  User,
  GeoPoint,
  newAnnouncementSchema,
  NewAnnouncementFormState,
  ErrandProps,
  newErrandSchema,
  NewErrandFormState,
  AccountType,
  ChatType,
  ChatMessage,
} from '@/src/app/lib/definitions';
import { getTranslations } from 'next-intl/server';
import { verifySession } from './dal';

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
  if (!formData) {
    return;
  }
  const { firstname, lastname, email, password, accountType, company, languages } = formData;
  if (formData.asCompany && formData.company) {
    const { companyName, nip, country, postalCode, street, city } = company;
    await sql(
      'INSERT INTO companies (name, nip, country, city, street, postal_code) VALUES ($1, $2, $3, $4, $5, $6)',
      [companyName, nip, country, city, street, postalCode],
    );
    const results = await sql('SELECT * FROM companies WHERE nip = $1', [nip]);
    await sql(
      'INSERT INTO users (first_name, last_name, email, password, account_type, company_id, languages, is_phisical_person) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        firstname,
        lastname,
        email,
        password,
        accountType,
        results[0]['company_id'],
        languages,
        false,
      ],
    );
  } else {
    await sql(
      'INSERT INTO users (first_name, last_name, email, password, account_type, company_id, languages, is_phisical_person) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [firstname, lastname, email, password, accountType, null, languages, true],
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
  const results = await sql('SELECT * FROM users WHERE email = $1 AND password = $2', [
    email,
    password,
  ]);

  if (results.length == 0) {
    return {
      errors: t('credentialsError'),
    };
  }
}

export async function getUserById(userId: string): Promise<User> {
  const user = await sql(
    'SELECT u.*, (SELECT COUNT(*) FROM announcements a WHERE a.author_id = u.user_id) as posts_count FROM users u WHERE u.user_id = $1',
    [userId],
  );
  return dbRowToObject(user[0], 'user') as User;
}

export async function getUserByEmail(email: string) {
  const user = await sql('SELECT * FROM users WHERE email = $1', [email]);
  return user[0];
}

function sortDirectionToSQL(sortBy: SortDirection, onColumn: string = '') {
  let by = '';
  switch (sortBy) {
    case SortDirection.ByNewest:
      by = 'created_at ASC';
      break;
    case SortDirection.ByOldest:
      by = 'created_at DESC';
      break;
    case SortDirection.ByWeightAsc:
      by = 'max_weight ASC';
      break;
    case SortDirection.ByWeightDesc:
      by = 'max_weight DESC';
      break;
    case SortDirection.ByHeightAsc:
      by = 'max_height ASC';
      break;
    case SortDirection.ByHeightDesc:
      by = 'max_height DESC';
      break;
    case SortDirection.BySizeAsc:
      by = 'size_x * size_y ASC';
      break;
    case SortDirection.BySizeDesc:
      by = 'size_x * size_y DESC';
      break;
  }
  return `ORDER BY ${onColumn}${by}`;
}

function filterOptionsToSQL(filterOptions: FilterProps, onColumn: string = ''): string {
  const conditions: string[] = [];

  // Dates
  if (filterOptions.date.departureDate.from) {
    conditions.push(`departure_date >= '${filterOptions.date.departureDate.from.toISOString()}'`);
  }
  if (filterOptions.date.departureDate.to) {
    conditions.push(`departure_date <= '${filterOptions.date.departureDate.to.toISOString()}'`);
  }
  if (filterOptions.date.arrivalDate.from) {
    conditions.push(`arrival_date >= '${filterOptions.date.arrivalDate.from.toISOString()}'`);
  }
  if (filterOptions.date.arrivalDate.to) {
    conditions.push(`arrival_date <= '${filterOptions.date.arrivalDate.to.toISOString()}'`);
  }

  // Cities
  if (filterOptions.cities.from) {
    conditions.push(`from_city ILIKE '%${filterOptions.cities.from}%'`);
  }
  if (filterOptions.cities.to) {
    conditions.push(`to_city ILIKE '%${filterOptions.cities.to}%'`);
  }

  // Goods
  if (filterOptions.goods.weight.from !== null) {
    conditions.push(`max_weight >= ${filterOptions.goods.weight.from}`);
  }
  if (filterOptions.goods.weight.to !== null) {
    conditions.push(`max_weight <= ${filterOptions.goods.weight.to}`);
  }

  if (filterOptions.goods.size.x.from !== null) {
    conditions.push(`size_x >= ${filterOptions.goods.size.x.from}`);
  }
  if (filterOptions.goods.size.x.to !== null) {
    conditions.push(`size_x <= ${filterOptions.goods.size.x.to}`);
  }

  if (filterOptions.goods.size.y.from !== null) {
    conditions.push(`size_y >= ${filterOptions.goods.size.y.from}`);
  }
  if (filterOptions.goods.size.y.to !== null) {
    conditions.push(`size_y <= ${filterOptions.goods.size.y.to}`);
  }

  if (filterOptions.goods.size.height.from !== null) {
    conditions.push(`max_height >= ${filterOptions.goods.size.height.from}`);
  }
  if (filterOptions.goods.size.height.to !== null) {
    conditions.push(`max_height <= ${filterOptions.goods.size.height.to}`);
  }

  // Category
  if (filterOptions.goods.category) {
    if (filterOptions.goods.category != GoodsCategory.All)
      conditions.push(`category = '${filterOptions.goods.category}'`);
  }

  if (conditions.length === 0) {
    return '';
  }

  return `WHERE ${onColumn}${conditions.join(' AND ')}`;
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
  const announcements: Array<AnnoucementProps | null> = [];

  dbrows.map((dbrow) => {
    if (!dbrow['is_accepted']) return;
    let row: AnnoucementProps | null = dbRowToObject(dbrow, 'annoucement') as AnnoucementProps;
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
    let row: ErrandProps | null = dbRowToObject(dbrow, 'errand') as ErrandProps;
    errands.push(row);
  });

  return errands;
}

export async function getAnnouncementsById(id: string): Promise<AnnoucementProps | null> {
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

  return dbRowToObject(result[0], 'annoucement') as AnnoucementProps;
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

  return dbRowToObject(result[0], 'errand') as ErrandProps;
}

function dbRowToObject(row: any, object: string) {
  let fromGeoPoint: GeoPoint;
  let toGeoPoint: GeoPoint;
  switch (object) {
    case 'errand':
      fromGeoPoint = {
        type: 'Point',
        coordinates: [Number(row['from_longitude']), Number(row['from_latitude'])],
      };

      toGeoPoint = {
        type: 'Point',
        coordinates: [Number(row['to_longitude']), Number(row['to_latitude'])],
      };

      const errand: ErrandProps = {
        id: row['errand_id'],
        title: row['title'],
        fromCity: row['from_city'],
        toCity: row['to_city'],
        fromGeography: fromGeoPoint,
        toGeography: toGeoPoint,
        earliestAt: new Date(row['earliest_at']),
        latestAt: new Date(row['latest_at']),
        ware: {
          weight: Number(row['ware_weight']),
          size: {
            x: Number(row['ware_size_x']),
            y: Number(row['ware_size_y']),
            height: Number(row['ware_height']),
          },
          name: row['ware_name'],
          category: row['ware_category'],
        },
        authorId: row['author_id'],
        isAccepted: row['is_accepted'],
        desc: row['description'],
        roadColor: row['road_color'],
      };
      return errand;
    case 'annoucement':
      fromGeoPoint = {
        type: 'Point',
        coordinates: [Number(row['from_longitude']), Number(row['from_latitude'])],
      };

      toGeoPoint = {
        type: 'Point',
        coordinates: [Number(row['to_longitude']), Number(row['to_latitude'])],
      };

      const announcement: AnnoucementProps = {
        id: row['announcement_id'],
        title: row['title'],
        fromCity: row['from_city'],
        toCity: row['to_city'],
        fromGeography: fromGeoPoint,
        toGeography: toGeoPoint,
        departureDate: new Date(row['start_date']),
        arrivalDate: new Date(row['arrive_date']),
        carProps: {
          maxWeight: Number(row['max_weight']),
          maxSize: {
            x: Number(row['size_x']),
            y: Number(row['size_y']),
            height: Number(row['max_height']),
          },
          brand: row['vehicle_brand'],
          model: row['vehicle_model'],
        },
        authorId: row['author_id'],
        isAccepted: row['is_accepted'],
        desc: row['description'],
        roadColor: row['road_color'],
      };
      return announcement;
    case 'user':
      const user: User = {
        id: row['user_id'],
        firstname: row['first_name'],
        lastname: row['last_name'],
        email: row['email'],
        createdAt: row['created_at'],
        accountType: row['account_type'],
        companyId: row['company_id'],
        lastSeen: row['last_logged'],
        languages: row['languages'],
        isPhisicalPerson: row['is_psyhical_person'],
        role: row['role'],
        userDesc: row['user_desc'],
        postCount: row['posts_count'],
      };
      return user;
    case 'chat':
      const chat: ChatType = {
        id: row['chat_id'],
        interestedUserId: row['interested_user_id'],
        postAuthorUserId: row['post_author_id'],
        interestedUserName: row['interested_user_name'],
        postAuthorUserName: row['post_author_name'],
        interestedUserLanguages: row['interested_user_languages'],
        postAuthorUserLanguages: row['post_author_languages'],
        title: row['title'],
      };
      return chat;
    case 'message':
      const message: ChatMessage = {
        id: row['message_id'],
        senderId: row['sender_id'],
        content: row['content'],
        sentAt: row['sent_at'],
        readen: row['readen'],
      };
      return message;
  }

  return null;
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
  return users.map((user) => dbRowToObject(user, 'user') as User);
}

export async function getChats(userId: string): Promise<ChatType[]> {
  let chats: ChatType[] = [];
  const dbChats = await sql(
    "SELECT c.*, COALESCE(ua.user_id, ue.user_id) as post_author_id, COALESCE(ua.languages, ue.languages) as post_author_languages, u.first_name || ' ' || u.last_name as interested_user_name, COALESCE(ua.first_name || ' ' || ua.last_name, ue.first_name || ' ' || ue.last_name ) as post_author_name, u.languages as interested_user_languages, COALESCE(a.title, e.title) as title FROM chats c LEFT JOIN announcements a ON c.announcement_id = a.announcement_id LEFT JOIN errands e ON c.errand_id = e.errand_id LEFT JOIN users ua ON a.author_id = ua.user_id LEFT JOIN users ue ON e.author_id = ue.user_id LEFT JOIN users u ON c.interested_user_id = u.user_id WHERE COALESCE(ua.user_id, ue.user_id) = $1 OR u.user_id = $1",
    [userId],
  );
  await Promise.all(
    dbChats.map(async (dbChat) => {
      let chat: ChatType = dbRowToObject(dbChat, 'chat') as ChatType;
      const dbMessages = await sql('SELECT * FROM messages WHERE chat_id = $1', [
        dbChat['chat_id'],
      ]);

      chat.messages = dbMessages.map(
        (dbMessage) => dbRowToObject(dbMessage, 'message') as ChatMessage,
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
    messages.push(dbRowToObject(dbMessage, 'message') as ChatMessage);
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
