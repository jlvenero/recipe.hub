import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // 1. Verifica a sessão para garantir que só usuários logados criem receitas
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Não autorizado. Faça login para salvar receitas." }, { status: 401 });
    }

    // 2. Extrai os dados enviados pelo frontend
    const body = await req.json();
    const { name, description, image, prepTime, ingredients, instructions } = body;

    // Proteção básica: o nome é o único campo obrigatório no seu schema (além do ID do usuário)
    if (!name) {
      return NextResponse.json({ error: "O nome da receita é obrigatório." }, { status: 400 });
    }

    // 3. Salva no banco de dados e vincula ao usuário autenticado
    const newRecipe = await prisma.recipe.create({
      data: {
        name,
        description: description || null,
        image: image || null,
        prepTime: prepTime || null,
        ingredients: ingredients || [],
        instructions: instructions || [],
        user: {
          connect: { email: session.user.email } 
        }
      }
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar receita no banco:", error);
    return NextResponse.json({ error: "Erro interno ao salvar a receita." }, { status: 500 });
  }
}