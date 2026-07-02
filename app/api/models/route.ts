import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "Chave API não encontrada no .env.local" }, { status: 400 });
    }

    // Fazemos uma requisição direta para a API REST do Google listando os modelos
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Erro na API do Google: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filtramos apenas os nomes dos modelos para facilitar a leitura
    const modelNames = data.models.map((m: any) => m.name);
    
    return NextResponse.json({ 
      disponiveis: modelNames 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}