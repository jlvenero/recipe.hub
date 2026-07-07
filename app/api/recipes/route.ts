import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
// IMPORTAÇÃO CORRIGIDA AQUI:
import { authOptions } from "@/lib/auth";

// ==========================================
// MÉTODO GET: Vai buscar as receitas para o Cookbook
// ==========================================
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Busca apenas as receitas do utilizador autenticado
    const recipes = await prisma.recipe.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: {
        createdAt: 'desc', // As mais recentes primeiro
      }
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Erro ao carregar receitas do banco:", error);
    return NextResponse.json({ error: "Erro interno ao carregar as receitas." }, { status: 500 });
  }
}

// ==========================================
// MÉTODO POST: Guarda as novas receitas (Importação)
// ==========================================
export async function POST(req: Request) {
  try {
    // 1. Verifica a sessão para garantir que só utilizadores logados criam receitas
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Não autorizado. Faça login para salvar receitas." }, { status: 401 });
    }

    // 2. Extrai os dados enviados pelo frontend
    const body = await req.json();
    const { name, description, image, prepTime, ingredients, instructions } = body;

    // Proteção básica: o nome é o único campo obrigatório no seu schema (além do ID do utilizador)
    if (!name) {
      return NextResponse.json({ error: "O nome da receita é obrigatório." }, { status: 400 });
    }

    // 3. Salva no banco de dados e vincula ao utilizador autenticado
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