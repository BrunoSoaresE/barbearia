'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addPagamentos, deletePagamentos, updatePagamentos } from '../repository/pagamento.repository';



const FormSchema = z.object({
  id: z.string(),
  clienteId: z.string({
    invalid_type_error: 'Please select a cliente.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an pagamento status.',
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

 
const CreatePagamento = FormSchema.omit({ id: true, date: true });
const UpdatePagamento = FormSchema.omit({ id: true, date: true });

 
export async function createPagamento(prevState: State,formData: FormData)
{    
  const validatedFields = CreatePagamento.safeParse({
      clienteId: formData.get('clienteId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
  });
    
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Pagamento.',
    };
  }

  const { clienteId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;  

    const date = new Date().toISOString().split('T')[0];

  try {
      await addPagamentos(clienteId, amountInCents, status, date);

    } catch (error) {
    return {
      message: 'Database Error: Failed to Create Pagamento.',
    };
  }

    revalidatePath('/dashboard/pagamentos');
    redirect('/dashboard/pagamentos');


}

export async function updatePagamento(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdatePagamento.safeParse({
    clienteId: formData.get('clienteId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Pagamento.',
    };
  }
 
  const { clienteId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await updatePagamentos(id, clienteId, amountInCents, status);
  
  } catch (error) {
    return { message: 'Database Error: Failed to Update Pagamento.' };
  }
 
  revalidatePath('/dashboard/pagamentos');
  redirect('/dashboard/pagamentos');
}

export async function deletePagamento(id: string) {
    
    try {
         await deletePagamentos(id)
         revalidatePath('/dashboard/pagamentos');
    } catch (error) {
    return { message: 'Database Error: Failed to Delete Pagamento.' };
  }
}

