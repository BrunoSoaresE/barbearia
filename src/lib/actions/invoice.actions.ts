'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addInvoices, deleteInvoices, updateInvoices } from '../repository/invoices.repository';



const FormSchema = z.object({
  id: z.string(),
  clienteId: z.string({
    invalid_type_error: 'Please select a cliente.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

export type State = {
  errors?: {
    clienteId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
}

 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

 
export async function createInvoice(prevState: State,formData: FormData)
{    
  const validatedFields = CreateInvoice.safeParse({
      clienteId: formData.get('clienteId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
  });
    
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { clienteId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;  

    const date = new Date().toISOString().split('T')[0];

  try {
      await addInvoices(clienteId, amountInCents, status, date);

    } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');


}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    clienteId: formData.get('clienteId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { clienteId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await updateInvoices(id, clienteId, amountInCents, status);
  
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    
    try {
         await deleteInvoices(id)
         revalidatePath('/dashboard/invoices');
    } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

