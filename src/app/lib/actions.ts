'use server';

import { createSession, deleteSession } from './session';
import { redirect } from '@/src/i18n/routing';
import { neon } from '@neondatabase/serverless';
import {
  AnnoucementProps,
  FilterProps,
  GoodsCategory,
  SignupFormData,
  SortDirection,
  ValidationErrors,
} from '@/src/app/lib/definitions';
import { getTranslations } from 'next-intl/server';

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
  await createSession(user['user_id'], user['role']);
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
  await createSession(user[0]['user_id'], user[0]['role']);
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

export async function getAnnouncements(sortBy: SortDirection, filterOptions: FilterProps) {
  let sqlString = `SELECT * FROM announcements ${filterOptionsToSQL(filterOptions)} ${sortDirectionToSQL(sortBy)}`;
  const dbAnnoucements = await sql(sqlString);
  const announcements: Array<AnnoucementProps> = [];
  dbAnnoucements.map((dbAnnoucement) => {
    if (!dbAnnoucement['is_accepted']) return;
    let annoucement: AnnoucementProps = {
      id: dbAnnoucement['announcement_id'],
      title: dbAnnoucement['title'],
      fromCity: dbAnnoucement['from_city'],
      toCity: dbAnnoucement['to_city'],
      fromGeography: dbAnnoucement['from_geography'],
      toGeography: dbAnnoucement['to_geography'],
      departureDate: dbAnnoucement['start_date'],
      arrivalDate: dbAnnoucement['arrive_date'],
      carProps: {
        maxWeight: dbAnnoucement['max_weight'],
        maxSize: {
          x: dbAnnoucement['size_x'],
          y: dbAnnoucement['size_y'],
          height: dbAnnoucement['max_height'],
        },
      },
      authorId: dbAnnoucement['author_id'],
      isAccepted: dbAnnoucement['is_accepted'],
    };
    announcements.push(annoucement);
  });
  return announcements;
}
