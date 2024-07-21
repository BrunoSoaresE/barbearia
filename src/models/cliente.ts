

export type Cliente = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type ListaCliente_Tabela = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_pagamentos: number;
  total_pending: number;
  total_paid: number;
};

export type ListaCliente_TabelaFormatada = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_pagamentos: number;
  total_pending: string;
  total_paid: string;
};

export type Cliente_Select = {
  id: string;
  name: string;
};


