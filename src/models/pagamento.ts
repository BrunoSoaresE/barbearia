
type PagamentoStatus = 'pending' | 'paid';

export type Pagamento = {
  id: string;
  customers_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: PagamentoStatus;
};


export type ListaUltimosPagamentos = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type ListaUltimosPagamentos_Formatada = Omit<ListaUltimosPagamentos, 'amount'> & {
  amount: number;
};

export type Pagamentos_Tabela = {
  id: string;
  customers_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: PagamentoStatus;
};


export type Pagamentos_Form = {
  id: string;
  customers_id: string;
  amount: number;
  status: PagamentoStatus;
};


export type Pagamentos_Cards = {
  numberOfClientes: number;
  numberOfPagamentos: number;
  totalPaidPagamentos: string;
  totalPendingPagamentos: string;
};