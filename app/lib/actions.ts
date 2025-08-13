'use server';

import { signIn } from '@/auth';

import { sql } from '@vercel/postgres';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import bcrypt from 'bcrypt';

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type SignupState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    required_error: 'Please select a customer',
    invalid_type_error: 'Please select a valid customer',
  }),
  amount: z.coerce.number().gt(0, 'Amount must be greater than 0'),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select a valid status',
  }),
  date: z.string(),
});

const SignupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData): Promise<State> {
  // validateFields returns an object containing either sucess or error
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    // is Stored in sents
    amount: Number(formData.get('amount')),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return { ...prevState, errors: validatedFields.error.flatten().fieldErrors };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch {
    // If a database error occurs, return a more specific error.

    return {
      message: `Database Error: Failed to Create Invoice.`,
    };
  }

  //   Will not do a thing for a dynamic page
  //   revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: Number(formData.get('amount')),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

export async function aunthenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials';
        default:
          return 'Something went wrong';
      }
    }
  }

  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard';
  redirect(redirectTo);
}

export async function signup(prevState: SignupState, formData: FormData): Promise<SignupState> {
  // Validate fields
  const validatedFields = SignupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If form validation fails, return errors early
  if (!validatedFields.success) {
    return { 
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.'
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Check if user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser.rows.length > 0) {
      return {
        message: 'A user with this email already exists.'
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;

    // Success - redirect to login
    redirect('/login?message=Account created successfully. Please log in.');
  } catch (error) {
    console.error('Signup error:', error);
    return {
      message: 'An error occurred while creating your account. Please try again.'
    };
  }
}
