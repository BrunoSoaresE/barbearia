import { sql } from '@vercel/postgres';
import {  Cliente_Select,  ListaCliente_Tabela, ListaCliente_TabelaFormatada } from '../../models/cliente';
import { formatCurrency } from '../utils';



export async function getClientes(): Promise<Cliente_Select[]> {
  try {
    const data = await sql<Cliente_Select>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const clientes = data.rows;
    return clientes;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to get all clientes.');
  }
}

export async function getFilteredClientes(query: string): Promise<ListaCliente_TabelaFormatada[]> {
  try {
    const data = await sql<ListaCliente_Tabela>`
		SELECT
		  clientes.id,
		  clientes.name,
		  clientes.email,
		  clientes.image_url,
		  COUNT(pagamentos.id) AS total_pagamentos,
		  SUM(CASE WHEN pagamentos.status = 'pending' THEN pagamentos.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN pagamentos.status = 'paid' THEN pagamentos.amount ELSE 0 END) AS total_paid
		FROM customers as clientes
		LEFT JOIN invoices as pagamentos ON clientes.id = pagamentos.customer_id
		WHERE
		  clientes.name ILIKE ${`%${query}%`} OR
        clientes.email ILIKE ${`%${query}%`}
		GROUP BY clientes.id, clientes.name, clientes.email, clientes.image_url
		ORDER BY clientes.name ASC
	  `;

    const clientes = data.rows.map((cliente) => ({
      ...cliente,
      total_pending: formatCurrency(cliente.total_pending),
      total_paid: formatCurrency(cliente.total_paid),
    }));

    return clientes;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to get cliente table.');
  }
}
