'use server';

import { createSession, deleteSession } from './session';
import { redirect } from '@/src/i18n/routing';
import { neon } from '@neondatabase/serverless';
import { AnnoucementProps, SignupFormData, ValidationErrors } from '@/src/app/lib/definitions';
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

export async function getAnnouncements() {
  const dbAnnoucements = await sql('SELECT * FROM announcements');
  const announcements: Array<AnnoucementProps> = [];
  dbAnnoucements.map((dbAnnoucement) => {
    if (!dbAnnoucement['is_accepted']) return;
    let annoucement: AnnoucementProps = {
      id: dbAnnoucement['annoucment_id'],
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
