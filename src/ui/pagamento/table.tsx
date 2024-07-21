import Image from 'next/image';
import { formatDateToLocal, formatCurrency } from '@/src/lib/utils';
import { getFilteredPagamentos } from '@/src/lib/repository/pagamento.repository';
import PagamentoStatus from './status';
import { UpdatePagamento, DeletePagamento } from './buttons';

export default async function Pagamentos_Tabela({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const pagamentos = await getFilteredPagamentos(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {pagamentos?.map((pagamento) => (
              <div
                key={pagamento.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={pagamento.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${pagamento.name}'s profile picture`}
                      />
                      <p>{pagamento.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{pagamento.email}</p>
                  </div>
                  <PagamentoStatus status={pagamento.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(pagamento.amount)}
                    </p>
                    <p>{formatDateToLocal(pagamento.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdatePagamento id={pagamento.id} />
                    <DeletePagamento id={pagamento.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Cliente
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pagamentos?.map((pagamento) => (
                <tr
                  key={pagamento.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={pagamento.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${pagamento.name}'s profile picture`}
                      />
                      <p>{pagamento.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {pagamento.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(pagamento.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(pagamento.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <PagamentoStatus status={pagamento.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePagamento id={pagamento.id} />
                      <DeletePagamento id={pagamento.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
