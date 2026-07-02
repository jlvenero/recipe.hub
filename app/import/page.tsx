"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao importar a receita.");
      }

      // Salva no Livro de Receitas do Navegador
      const newRecipe = { 
        ...data, 
        id: Date.now().toString() 
      };
      
      const existingRecipes = JSON.parse(localStorage.getItem("recipeHub_cookbook") || "[]");
      localStorage.setItem("recipeHub_cookbook", JSON.stringify([...existingRecipes, newRecipe]));

      // Vai para a tela do Livro
      router.push("/cookbook");

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false); // Só paramos o loading se der erro. Se der certo, a tela muda.
    } 
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-8 py-16 md:py-24 w-full">
        <div className="mb-12">
          <p className="text-[10px] font-bold text-[#9C4A3A] tracking-[0.15em] uppercase mb-6">
            Import
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-light text-[#2A2927] mb-6 leading-[1.1]">
            Cole um link. <br />
            Mantenha o <span className="italic">sabor.</span>
          </h1>
        </div>

        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#EAE6DF]">
          <form onSubmit={handleSubmit}>
            <label className="block text-[10px] font-bold text-[#8A857F] tracking-[0.15em] uppercase mb-4">
              URL da Receita
            </label>
            
            <div className="flex items-center gap-3 border-b border-[#EAE6DF] pb-3 mb-8">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A857F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full bg-transparent outline-none text-[#2A2927] placeholder:text-[#CDCECA]"
              />
            </div>

            <div className="flex items-center gap-6">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#9C4A3A] text-[#FAF8F5] px-8 py-3.5 rounded-full font-medium hover:bg-[#823B2E] transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? "Extraindo com IA..." : "Importar receita"}
              </button>
            </div>
            
            {error && <p className="text-red-500 text-xs font-medium mt-4">{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}