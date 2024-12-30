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

export async function getUserById(userId: string) {
  const user = await sql('SELECT * FROM users WHERE user_id = $1', [userId]);
  return user[0];
}

export async function getUserByEmail(email: string) {
  const user = await sql('SELECT * FROM users WHERE email = $1', [email]);
  return user[0];
}

function sortDirectionToSQL(sortBy: SortDirection) {
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
  return `ORDER BY ${by}`;
}

function filterOptionsToSQL(filterOptions: FilterProps): string {
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

  return `WHERE ${conditions.join(' AND ')}`;
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

function dbRowToObject(row: any, object: string) {
  switch (object) {
    case 'annoucement':
      const fromGeoPoint: GeoPoint = {
        type: 'Point',
        coordinates: [Number(row['from_longitude']), Number(row['from_latitude'])],
      };

      const toGeoPoint: GeoPoint = {
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
      };
      return user;
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
