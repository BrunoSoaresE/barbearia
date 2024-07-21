import { getFilteredClientes } from '@/src/lib/repository/cliente.repository';
import { authUsuario } from '@/src/lib/utils';
import type { NextApiRequest } from 'next'

import { NextResponse } from "next/server";
const secret = process.env.AUTH_SECRET as string;

//http://localhost:3000/api/cliente/list-tabela?query=John
export async function GET(request: NextApiRequest) {
  await authUsuario();  
  
  
  const { url } = request;
  const { searchParams } = new URL(url as string);
  const name = searchParams.get('query');  
  var result = await getFilteredClientes(name ?? "");

  return NextResponse.json(result, { status: 200 });
}



