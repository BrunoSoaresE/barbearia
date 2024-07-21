import Search from '@/src/ui/search';
import { lusitana } from '@/src/ui/fonts';
import { Pagamentos_TabelaSkeleton } from '@/src/ui/skeletons';
import { Suspense } from 'react';
 

 import { Metadata } from 'next';
import { getPagamentosPages } from '@/src/lib/repository/pagamento.repository';
import { CreatePagamento } from '@/src/ui/pagamento/buttons';
import Table from '@/src/ui/pagamento/table';
import Pagination from '@/src/ui/pagamento/pagination';
 
export const metadata: Metadata = {
  title: 'Pagamentos',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await getPagamentosPages(query);


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Pagamentos</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search pagamentos..." />
        <CreatePagamento />
      </div>
       <Suspense key={query + currentPage} fallback={<Pagamentos_TabelaSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}