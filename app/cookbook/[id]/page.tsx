import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import RecipeClient from "./RecipeClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipeDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // Busca a receita direto do Prisma
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: id,
      user: { email: session.user.email },
    },
  });

  if (!recipe) {
    notFound();
  }

  // Passa a receita para o seu visual
  return <RecipeClient initialRecipe={recipe} recipeId={id} />;
}