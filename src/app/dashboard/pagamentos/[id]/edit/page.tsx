import { getPagamentoById } from '@/src/lib/repository/pagamento.repository';
import notFound from './not-found';

 import { Metadata } from 'next';
import { getClientes } from '@/src/lib/repository/cliente.repository';
import Breadcrumbs from '@/src/ui/pagamento/breadcrumbs';
import Form from '@/src/ui/pagamento/create-form';
 
export const metadata: Metadata = {
  title: 'Edit Pagamentos',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

   const [pagamento, clientes] = await Promise.all([
    getPagamentoById(id),
    getClientes(),
   ]);
  
   if (!pagamento) {
    return notFound();
  }
  
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Pagamentos', href: '/dashboard/pagamentos' },
          {
            label: 'Edit Pagamento',
            href: `/dashboard/pagamentos/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form pagamento={pagamento} clientes={clientes} />
    </main>
  );
}