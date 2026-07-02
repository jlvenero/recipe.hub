import Navbar from "@/components/Navbar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function CookbookPage() {
  // 1. Pega a sessão do usuário que está logado
  const session = await getServerSession(authOptions);

  // 2. Proteção de rota: Se não tiver ninguém logado, joga para o login
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // 3. Busca no banco de dados (Prisma) APENAS as receitas deste usuário
  const recipes = await prisma.recipe.findMany({
    where: {
      user: {
        email: session.user.email, // Relacionamento inteligente do Prisma!
      },
    },
    orderBy: {
      createdAt: 'desc', // Mostra as mais recentes primeiro
    }
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-8 py-16 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-[10px] font-bold text-[#9C4A3A] tracking-[0.15em] uppercase mb-4">
              Seu Livro de Receitas
            </p>
            <h1 className="text-5xl md:text-6xl font-serif text-[#2A2927]">
              Os pratos coletados .
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center border-b border-[#CDCECA] pb-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A857F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Pesquisar por título" 
                className="bg-transparent outline-none text-sm text-[#2A2927] placeholder:text-[#8A857F] w-48"
              />
            </div>
            <Link href="/import" className="bg-[#9C4A3A] text-[#FAF8F5] px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#823B2E] transition-colors flex items-center gap-2">
              <span>+</span> Importar
            </Link>
          </div>
        </div>

        {/* Grade de Receitas */}
        {recipes.length === 0 ? (
          <div className="text-center py-20 text-[#8A857F]">
            Nenhuma receita importada ainda. Vá até a aba Importar!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Link key={recipe.id} href={`/cookbook/${recipe.id}`} className="block group">
                <div className="bg-white rounded-[2rem] overflow-hidden border border-[#EAE6DF] hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="h-64 bg-[#EAE6DF] relative overflow-hidden">
                    {recipe.image ? (
                      <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sem Imagem</div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-[10px] font-bold text-[#8A857F] tracking-[0.15em] uppercase mb-3">
                      Importado
                    </p>
                    <h3 className="text-2xl font-serif text-[#2A2927] mb-4 leading-tight flex-1">
                      {recipe.name}
                    </h3>
                    <div className="flex items-center text-xs text-[#8A857F] font-medium">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {recipe.prepTime || "60 min"}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}