import Form from '@/src/ui/pagamento/create-form';
import Breadcrumbs from '@/src/ui/pagamento/breadcrumbs';
 
import { Metadata } from 'next';
import { getClientes } from '@/src/lib/repository/cliente.repository';
 
export const metadata: Metadata = {
  title: 'Create Pagamentos',
};

export default async function Page() {
  const clientes = await getClientes();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Pagamentos', href: '/dashboard/pagamentos' },
          {
            label: 'Create Pagamento',
            href: '/dashboard/pagamentos/create',
            active: true,
          },
        ]}
      />
      <Form clientes={clientes} />
    </main>
  );
}