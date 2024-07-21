import { lusitana } from '@/src/ui/fonts';
import { Suspense } from 'react';
import {
  ReceitaChartSkeleton,
  ListaUltimosPagamentosSkeleton,
  CardsSkeleton,
} from '@/src/ui/skeletons';

import ListaUltimosPagamentos from '@/src/ui/pagamento/dashboard/ultimos-pagamento';
import CardWrapper from '@/src/ui/pagamento/dashboard/cards';
import ReceitaChart from '@/src/ui/pagamento/dashboard/receita-chart';

 
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
         <Suspense fallback={<ReceitaChartSkeleton />}>
          <ReceitaChart />
        </Suspense>
          <Suspense fallback={<ListaUltimosPagamentosSkeleton />}>
          <ListaUltimosPagamentos />
        </Suspense>
      </div>
    </main>
  );
}