import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { pagamentos, clientes, receita, users } from './placeholder-data';

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedPagamentos() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS pagamentos (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customers_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedPagamentos = await Promise.all(
    pagamentos.map(
      (pagamento) => client.sql`
        INSERT INTO pagamentos (customers_id, amount, status, date)
        VALUES (${pagamento.customers_id}, ${pagamento.amount}, ${pagamento.status}, ${pagamento.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedPagamentos;
}

async function seedClientes() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS clientes (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedClientes = await Promise.all(
    clientes.map(
      (cliente) => client.sql`
        INSERT INTO clientes (id, name, email, image_url)
        VALUES (${cliente.id}, ${cliente.name}, ${cliente.email}, ${cliente.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedClientes;
}

async function seedReceita() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS receita (
      month VARCHAR(4) NOT NULL UNIQUE,
      receita INT NOT NULL
    );
  `;

  const insertedReceita = await Promise.all(
    receita.map(
      (rev) => client.sql`
        INSERT INTO receita (month, receita)
        VALUES (${rev.month}, ${rev.receita})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedReceita;
}

export async function GET() {
  
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedClientes();
    await seedPagamentos();
    await seedReceita();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
