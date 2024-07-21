import Form from '@/src/ui/pagamentos/create-form';
import Breadcrumbs from '@/src/ui/pagamentos/breadcrumbs';
import { getClientes } from '@/src/lib/repository/clientes.repository';
 
import { Metadata } from 'next';
 
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