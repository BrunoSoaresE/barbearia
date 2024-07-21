import { authUsuario } from '@/src/lib/actions/authenticate.actions';
import { getClientes } from '@/src/lib/repository/cliente.repository';
import { NextRequest, NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET(request: NextRequest) {
  await authUsuario();  


  var result = await getClientes();
  return NextResponse.json(result, { status: 200 });
}



//getFilteredClientes(query: string): Promise<ListaCliente_TabelaFormatada[]> {

// To handle a POST request to /api
export async function POST(request: NextRequest) {
  await authUsuario();  
  
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}
