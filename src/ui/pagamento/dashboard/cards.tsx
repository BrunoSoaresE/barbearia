import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/src/ui/fonts';
import { getCardData } from '@/src/lib/repository/pagamento.repository';

const iconMap = {
  collected: BanknotesIcon,
  clientes: UserGroupIcon,
  pending: ClockIcon,
  pagamentos: InboxIcon,
};

export default async function CardWrapper() {
     const { numberOfClientes,
            numberOfPagamentos,
            totalPaidPagamentos,
            totalPendingPagamentos, } = await getCardData();

  return (
    <>

      <Card title="Collected" value={totalPaidPagamentos} type="collected" />
      <Card title="Pending" value={totalPendingPagamentos} type="pending" />
      <Card title="Total Pagamentos" value={numberOfPagamentos} type="pagamentos" />
      <Card
        title="Total Clientes"
        value={numberOfClientes}
        type="clientes"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'pagamentos' | 'clientes' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
