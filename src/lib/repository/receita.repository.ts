import { Receita } from '@/src/models/receita';
import { sql } from '@vercel/postgres';

export async function getReceita(): Promise<Receita[]> {
  try {
    //await new Promise((resolve) => setTimeout(resolve, 1500));
    const data = await sql<Receita>`SELECT month, revenue as receita  FROM revenue`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get receita data.');
  }
}

