'use server';

import { neon } from '@neondatabase/serverless';
import { SignupFormData, ValidationErrors } from '@/src/app/lib/definitions';
import { getTranslations } from 'next-intl/server';
import { createSession } from '@/src/app/lib/session';
import { redirect } from 'next/navigation';

const sql = neon(`${process.env.DATABASE_URL}`);

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
  await createSession(user[0]['user_id']);
  redirect('/');
}

export async function checkIfUserExists(formData: SignupFormData): Promise<ValidationErrors> {
  const t = await getTranslations('signup');

  const errors: ValidationErrors = {};
  const results = await sql('SELECT * FROM users WHERE email = $1', [formData.email]);

  errors.email = results.length > 0 ? t('emailIsUsed') : '';

  return errors;
}

export async function checkCredentials(formData: { email: any; password: any }) {
  const t = await getTranslations('login');
  const results = await sql('SELECT * FROM users WHERE email = $1 AND password = $2', [
    formData.email,
    formData.password,
  ]);

  if (results.length == 0) {
    return {
      errors: t('credentialsError'),
    };
  }
}
