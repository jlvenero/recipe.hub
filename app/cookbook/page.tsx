"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

// Definição do tipo para ajudar no autocompletar
interface Recipe {
  id: string;
  name: string;
  prepTime: string;
  image?: string | null;
}

export default function CookbookPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. Estado para guardar o texto da busca
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("/api/recipes");
        if (res.ok) {
          const data = await res.json();
          setRecipes(data);
        }
      } catch (error) {
        console.error("Erro ao carregar receitas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // 2. MELHOR PRÁTICA: Filtragem em tempo real com useMemo
  // O useMemo garante que a filtragem só aconteça se a palavra digitada ou a lista de receitas mudar
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => 
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [recipes, searchTerm]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-8 py-16 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <p className="text-[10px] font-bold text-[#9C4A3A] tracking-[0.15em] uppercase mb-4">
              Seu Acervo
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#2A2927]">
              Livro de <span className="italic">Receitas</span>
            </h1>
          </div>

          {/* 3. Campo de Busca Solitário (Botão Importar Removido) */}
          <div className="w-full md:w-72 relative">
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CDCECA]" 
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Buscar receita..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#EAE6DF] pl-10 pr-4 py-3 rounded-full outline-none focus:border-[#9C4A3A] transition-colors text-sm text-[#2A2927] placeholder:text-[#CDCECA] shadow-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20 text-[#8A857F] animate-pulse">
            Carregando seus sabores...
          </div>
        ) : (
          <>
            {/* 4. Usamos filteredRecipes.length em vez de recipes.length */}
            {filteredRecipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center w-full max-w-lg mx-auto">
                <div className="w-full h-48 sm:h-64 mb-8 bg-[#EAE6DF] rounded-[2rem] overflow-hidden relative shadow-sm border border-[#CDCECA]">
                  <img 
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop" 
                    alt="Cozinha vazia" 
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-[#2A2927]/20 backdrop-blur-[2px]">
                    <span className="text-5xl drop-shadow-md">🍽️</span>
                  </div>
                </div>
                
                {/* Ajustamos o texto caso a busca não retorne nada */}
                <h2 className="text-3xl font-serif text-[#2A2927] mb-4">
                  {searchTerm ? "Nenhuma receita encontrada" : "Seu livro está vazio"}
                </h2>
                <p className="text-[#8A857F] text-base mb-8 leading-relaxed">
                  {searchTerm 
                    ? `Não encontramos nada com "${searchTerm}". Tente buscar por outro termo.` 
                    : "Você ainda não tem nenhuma receita no seu acervo. Que tal importar seu prato favorito de um site ou pedir para nossa IA sugerir uma nova ideia?"}
                </p>
                
                {/* Se não houver termo de busca, mostra o botão para adicionar a primeira receita */}
                {!searchTerm && (
                  <Link href="/import" className="bg-[#9C4A3A] text-[#FAF8F5] px-8 py-3.5 rounded-full text-sm font-medium hover:bg-[#823B2E] transition-colors inline-flex items-center gap-2 shadow-sm">
                    <span>+</span> Adicionar Primeira Receita
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                
                {/* 5. Mapeamos as receitas FILTRADAS para criar os cards */}
                {filteredRecipes.map((recipe) => (
                  <Link key={recipe.id} href={`/cookbook/${recipe.id}`} className="group block">
                    <div className="bg-white rounded-[2rem] overflow-hidden border border-[#EAE6DF] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow h-full flex flex-col">
                      <div className="h-48 bg-[#EAE6DF] relative overflow-hidden">
                        {recipe.image ? (
                          <img 
                            src={recipe.image} 
                            alt={recipe.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl bg-[#F2EFEA]">
                            🍲
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-[#2A2927] uppercase">
                          {recipe.prepTime}
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-serif text-[#2A2927] mb-2 group-hover:text-[#9C4A3A] transition-colors line-clamp-2">
                          {recipe.name}
                        </h3>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-xs text-[#8A857F] font-medium uppercase tracking-widest">
                            Ver receita
                          </span>
                          <span className="text-[#9C4A3A] group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}