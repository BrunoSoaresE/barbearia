import { lusitana } from '@/src/ui/fonts';
import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  ListaUltimosPagamentosSkeleton,
  CardsSkeleton,
} from '@/src/ui/skeletons';

import ListaUltimosPagamentos from '@/src/ui/pagamento/dashboard/ultimos-pagamento';
import CardWrapper from '@/src/ui/pagamento/dashboard/cards';
import RevenueChart from '@/src/ui/pagamento/dashboard/revenue-chart';

 
export default async function Page() {


  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">  
         <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
         <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
          <Suspense fallback={<ListaUltimosPagamentosSkeleton />}>
          <ListaUltimosPagamentos />
        </Suspense>
      </div>
    </main>
  );
}