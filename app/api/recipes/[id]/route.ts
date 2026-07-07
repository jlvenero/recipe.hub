// app/api/recipes/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // 1. Busca a receita no banco para verificar quem é o dono
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: { user: true } // Trazemos o usuário vinculado para comparar
    });

    if (!recipe) {
      return NextResponse.json({ error: "Receita não encontrada." }, { status: 404 });
    }

    // 2. Bloqueia a ação se o e-mail do autor não for o mesmo da sessão atual
    if (recipe.user.email !== session.user.email) {
      return NextResponse.json({ error: "Acesso negado. Você não tem permissão para excluir esta receita." }, { status: 403 });
    }

    // 3. Se passou pela validação, deleta com segurança
    await prisma.recipe.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar receita:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}