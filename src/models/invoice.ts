
type InvoiceStatus = 'pending' | 'paid';

export type Invoice = {
  id: string;
  customers_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: InvoiceStatus;
};


export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customers_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
};


export type InvoiceForm = {
  id: string;
  customers_id: string;
  amount: number;
  status: InvoiceStatus;
};


export type InvoicesCards = {
  numberOfClientes: number;
  numberOfInvoices: number;
  totalPaidInvoices: string;
  totalPendingInvoices: string;
};