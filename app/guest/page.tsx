"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import Link from "next/link";

export default function GuestPage() {
  const [mode, setMode] = useState<"url" | "ai">("url");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recipe, setRecipe] = useState<any>(null);

  // === ESTADOS DO MODO COZINHA ===
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // === FUNÇÕES DO MODO COZINHA ===
  const startCooking = async () => {
    setCurrentStep(0);
    setIsCookingMode(true);
    
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        // @ts-ignore
        if (window.screen.orientation && window.screen.orientation.lock) {
          // @ts-ignore
          await window.screen.orientation.lock("landscape");
        }
      }
    } catch (error) {
      console.log("Navegador não suporta rotação forçada ou tela cheia sem permissão.");
    }
  };

  const stopCooking = async () => {
    setIsCookingMode(false);
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
      // @ts-ignore
      if (window.screen.orientation && window.screen.orientation.unlock) {
        // @ts-ignore
        window.screen.orientation.unlock();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setRecipe(null);

    try {
      const payload = mode === "url" ? { url: inputValue } : { query: inputValue };

      const extractResponse = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const extractedData = await extractResponse.json();

      if (!extractResponse.ok) {
        throw new Error(extractedData.error || "Erro ao processar a receita.");
      }

      setRecipe(extractedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🍳 TELA DO MODO DE COZIMENTO (Renderiza por cima de tudo)
  if (isCookingMode && recipe) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#1C1B19] text-[#FAF8F5] flex flex-col font-sans animate-in fade-in duration-300">
        <div className="flex justify-between items-center p-4 md:p-8 border-b border-[#2A2927]">
          <span className="text-lg md:text-xl font-serif text-[#D4A373] truncate pr-4">{recipe.name}</span>
          <button 
            onClick={stopCooking} 
            className="text-[#8A857F] hover:text-white flex items-center gap-2 text-xs md:text-sm tracking-widest uppercase font-bold"
          >
            ✕ Sair
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-24 text-center relative overflow-y-auto">
          <p className="text-[#D4A373] tracking-[0.2em] text-xs md:text-sm font-bold uppercase mb-4 md:mb-8">
            Passo {currentStep + 1} de {recipe.instructions.length}
          </p>
          
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-serif font-light leading-tight max-w-5xl mb-24 md:mb-0">
            {recipe.instructions[currentStep]}
          </h2>

          <div className="fixed md:absolute bottom-6 md:bottom-12 w-full flex justify-between px-6 md:px-24 left-0">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="text-base md:text-2xl font-serif italic text-[#8A857F] hover:text-white disabled:opacity-20 transition-colors"
            >
              ← Anterior
            </button>
            <button
              disabled={currentStep === recipe.instructions.length - 1}
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="text-base md:text-2xl font-serif italic text-[#D4A373] hover:text-white disabled:opacity-20 transition-colors"
            >
              Próximo →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 📄 TELA NORMAL DO CONVIDADO
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-8 py-16 w-full">
        {!recipe ? (
          <>
            <div className="mb-12 text-center">
              <p className="text-[10px] font-bold text-[#9C4A3A] tracking-[0.15em] uppercase mb-4">
                Acesso de Convidado
              </p>
              <h1 className="text-4xl md:text-5xl font-serif font-light text-[#2A2927] mb-4">
                Teste o nosso <span className="italic">Chef IA.</span>
              </h1>
              <p className="text-[#8A857F]">
                Extraia ou crie uma receita agora mesmo. Nenhuma conta necessária.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#EAE6DF] max-w-2xl mx-auto">
              <div className="flex gap-6 mb-8 border-b border-[#EAE6DF] pb-4 justify-center">
                <button 
                  type="button"
                  onClick={() => { setMode("url"); setError(""); setInputValue(""); }} 
                  className={`text-xs font-bold uppercase tracking-widest pb-2 transition-colors ${mode === "url" ? "text-[#9C4A3A] border-b-2 border-[#9C4A3A]" : "text-[#8A857F] hover:text-[#2A2927]"}`}
                >
                  Colar Link
                </button>
                <button 
                  type="button"
                  onClick={() => { setMode("ai"); setError(""); setInputValue(""); }} 
                  className={`text-xs font-bold uppercase tracking-widest pb-2 transition-colors ${mode === "ai" ? "text-[#9C4A3A] border-b-2 border-[#9C4A3A]" : "text-[#8A857F] hover:text-[#2A2927]"}`}
                >
                  Pedir para IA
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <input
                  type={mode === "url" ? "url" : "text"}
                  placeholder={mode === "url" ? "https://site-de-receita.com..." : "Ex: Bolo de cenoura com cobertura..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-[#EAE6DF] py-3 outline-none focus:border-[#9C4A3A] transition-colors text-[#2A2927] placeholder:text-[#CDCECA]"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#9C4A3A] text-[#FAF8F5] py-4 rounded-full font-medium hover:bg-[#823B2E] transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Preparando magia..." : (mode === "url" ? "Extrair Receita" : "Gerar Receita")}
                </button>

                {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}
              </form>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-[#EAE6DF] relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2A2927] text-[#FAF8F5] px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap shadow-md">
              Modo Convidado
            </div>

            <div className="mb-10 text-center mt-4">
              <h1 className="text-4xl font-serif text-[#2A2927] mb-4">{recipe.name}</h1>
              <p className="text-[#8A857F] text-sm mb-6">{recipe.description}</p>
              
              {/* Botões do Tempo e Modo Cozinha */}
              <div className="flex gap-4 justify-center items-center flex-wrap">
                <span className="inline-block bg-[#F2EFEA] text-[#8A857F] px-4 py-2 rounded-full text-xs font-medium">
                  ⏱️ {recipe.prepTime}
                </span>
                <button 
                  onClick={startCooking}
                  className="bg-[#9C4A3A] text-[#FAF8F5] px-6 py-2 rounded-full text-xs font-medium hover:bg-[#823B2E] transition-colors flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path><line x1="6" y1="17" x2="18" y2="17"></line></svg>
                  Ativar Modo Cozinha
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-1">
                <h3 className="text-xs font-bold text-[#9C4A3A] tracking-widest uppercase mb-6">Ingredientes</h3>
                <ul className="space-y-3">
                  {recipe.ingredients?.map((ing: string, i: number) => (
                    <li key={i} className="text-[#6B6661] text-sm border-b border-[#EAE6DF] pb-2">
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-xs font-bold text-[#9C4A3A] tracking-widest uppercase mb-6">Modo de Preparo</h3>
                <ol className="space-y-6">
                  {recipe.instructions?.map((step: string, i: number) => (
                    <li key={i} className="text-[#6B6661] text-sm flex gap-4">
                      <span className="font-serif text-[#CDCECA] text-xl font-light">{i + 1}.</span>
                      <span className="mt-1 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Fica o convite para criar a conta */}
            <div className="mt-16 bg-[#FAF8F5] p-8 rounded-2xl text-center border border-[#EAE6DF]">
              <h3 className="text-xl font-serif text-[#2A2927] mb-2">A experiência foi útil?</h3>
              <p className="text-[#8A857F] text-sm mb-6 max-w-md mx-auto">
                No Recipe.Hub você pode ajustar as porções dos ingredientes e salvar quantas receitas quiser no seu acervo pessoal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/join" className="bg-[#9C4A3A] text-[#FAF8F5] px-8 py-3 rounded-full text-sm font-medium hover:bg-[#823B2E] transition-colors">
                  Criar minha conta gratuita
                </Link>
                <button 
                  onClick={() => setRecipe(null)}
                  className="text-[#8A857F] text-sm font-medium hover:text-[#2A2927] transition-colors px-4 py-3"
                >
                  Fazer outra busca
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}