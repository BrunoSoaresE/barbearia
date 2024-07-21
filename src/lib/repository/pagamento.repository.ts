import { sql } from '@vercel/postgres';


import { formatCurrency } from '../utils';
import { ListaUltimosPagamentos_Formatada, Pagamentos_Tabela, Pagamentos_Form, Pagamentos_Cards, ListaUltimosPagamentos } from '@/src/models/pagamento';


export async function getListaUltimosPagamentos(): Promise<ListaUltimosPagamentos[]> {
  try {


    await new Promise((resolve) => setTimeout(resolve, 1000));




    const data = await sql<ListaUltimosPagamentos_Formatada>`
      SELECT pagamentos.amount, clientes.name, clientes.image_url, clientes.email, pagamentos.id
      FROM invoices as pagamentos
      JOIN customers as clientes ON pagamentos.customer_id = clientes.id
      ORDER BY pagamentos.date DESC
      LIMIT 5`;
    
    console.log('Data get completed after 3 seconds. getListaUltimosPagamentos');
    console.log('Data get completed after 3 seconds. getListaUltimosPagamentos');
    
    

    const listaUltimosPagamentos = data.rows.map((pagamento) => ({
      ...pagamento,
      amount: formatCurrency(pagamento.amount),
    }));



    return listaUltimosPagamentos;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get the latest pagamentos.');
  }
}

export async function getCardData(): Promise<Pagamentos_Cards> {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const pagamentoCountPromise = sql`SELECT COUNT(*) FROM invoices as pagamentos`;
    const clienteCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const pagamentoStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices as pagamentos`;

    const data = await Promise.all([
      pagamentoCountPromise,
      clienteCountPromise,
      pagamentoStatusPromise,
    ]);

    const numberOfPagamentos = Number(data[0].rows[0].count ?? '0');
    const numberOfClientes = Number(data[1].rows[0].count ?? '0');
    const totalPaidPagamentos = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingPagamentos = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfClientes,
      numberOfPagamentos,
      totalPaidPagamentos,
      totalPendingPagamentos,
    } as Pagamentos_Cards;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function getFilteredPagamentos(
  query: string,
  currentPage: number,
): Promise<Pagamentos_Tabela[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const pagamentos = await sql<Pagamentos_Tabela>`
      SELECT
        pagamentos.id,
        pagamentos.amount,
        pagamentos.date,
        pagamentos.status,
        clientes.name,
        clientes.email,
        clientes.image_url
      FROM invoices as pagamentos
      JOIN customers as clientes ON pagamentos.customer_id = clientes.id
      WHERE
        clientes.name ILIKE ${`%${query}%`} OR
        clientes.email ILIKE ${`%${query}%`} OR
        pagamentos.amount::text ILIKE ${`%${query}%`} OR
        pagamentos.date::text ILIKE ${`%${query}%`} OR
        pagamentos.status ILIKE ${`%${query}%`}
      ORDER BY pagamentos.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return pagamentos.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get pagamentos.');
  }
}

export async function getPagamentosPages(query: string): Promise<number> {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices as pagamentos
    JOIN customers as clientes ON pagamentos.customer_id = clientes.id
    WHERE
      clientes.name ILIKE ${`%${query}%`} OR
      clientes.email ILIKE ${`%${query}%`} OR
      pagamentos.amount::text ILIKE ${`%${query}%`} OR
      pagamentos.date::text ILIKE ${`%${query}%`} OR
      pagamentos.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get total number of pagamentos.');
  }
}

export async function getPagamentoById(id: string): Promise<Pagamentos_Form> {
  try {
    const data = await sql<Pagamentos_Form>`
      SELECT
        pagamentos.id,
        pagamentos.customer_id,
        pagamentos.amount,
        pagamentos.status
      FROM invoices as pagamentos
      WHERE pagamentos.id = ${id}
      order by pagamentos.id;
    `;

    const pagamento = data.rows.map((pagamento) => ({
      ...pagamento,
      // Convert amount from cents to dollars
      amount: pagamento.amount / 100,
    }));
    


    return pagamento[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get pagamento.');
  }
}



export async function addPagamentos(clienteId: string, amountInCents: number, status: string, date: string): Promise<void> {
  try {

      await sql`
          INSERT INTO invoices (customers_id, amount, status, date)
          VALUES (${clienteId}, ${amountInCents}, ${status}, ${date})
      `;
    
    
  } catch (error) {
    console.error('Database Error: Failed to Create Pagamento:', error);
    throw new Error('Database Error: Failed to Create Pagamento.');
  }
}



export async function updatePagamentos(id: string,clienteId: string, amountInCents: number, status: string): Promise<void>{
  try {

      await sql`
      UPDATE invoices
      SET customers_id = ${clienteId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
    
    
  } catch (error) {
    console.error('Database Error: Failed to Update Pagamento:', error);
    throw new Error('Database Error: Failed to Update Pagamento.');
  }
}

export async function deletePagamentos(id: string): Promise<void> {
  try {

       await sql`DELETE FROM invoices WHERE id = ${id}`;
    
  } catch (error) {
    console.error('Database Error: Failed to Delete Pagamento:', error);
    throw new Error('Database Error: Failed to Delete Pagamento.');
  }
}





