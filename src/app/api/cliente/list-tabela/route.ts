import { authUsuario } from '@/src/lib/actions/authenticate.actions';
import { getFilteredClientes } from '@/src/lib/repository/cliente.repository';

import { NextRequest, NextResponse } from "next/server";

//http://localhost:3000/api/cliente/list-tabela?query=John
export async function GET(request: NextRequest) {
  await authUsuario();  
  
  
  const { url } = request;
  const { searchParams } = new URL(url as string);
  const name = searchParams.get('query');  
  var result = await getFilteredClientes(name ?? "");

  return NextResponse.json(result, { status: 200 });
}



