"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const cleanText = (text: string) => {
  if (!text) return "";
  let fixed = text.replace(/&amp;/g, '&');
  const entities: { [key: string]: string } = {
    '&ccedil;': 'ç', '&Ccedil;': 'Ç', '&nbsp;': ' ', '&ordm;': 'º', '&ordf;': 'ª',
    '&atilde;': 'ã', '&Atilde;': 'Ã', '&otilde;': 'õ', '&Otilde;': 'Õ',
    '&aacute;': 'á', '&Aacute;': 'Á', '&eacute;': 'é', '&Eacute;': 'É',
    '&iacute;': 'í', '&Iacute;': 'Í', '&oacute;': 'ó', '&Oacute;': 'Ó',
    '&uacute;': 'ú', '&Uacute;': 'Ú', '&acirc;': 'â', '&Acirc;': 'Â',
    '&ecirc;': 'ê', '&Ecirc;': 'Ê', '&icirc;': 'î', '&Icirc;': 'Î',
    '&ocirc;': 'ô', '&Ocirc;': 'Ô', '&ucirc;': 'û', '&Ucirc;': 'Û',
    '&agrave;': 'à', '&Agrave;': 'À', '&#39;': "'", '&quot;': '"',
    '&lt;': '<', '&gt;': '>'
  };
  return fixed.replace(/&[#a-zA-Z0-9]+;/g, (match) => entities[match] || match);
};

export default function RecipeClient({ initialRecipe, recipeId }: { initialRecipe: any, recipeId: string }) {
  const router = useRouter();
  const [recipe] = useState<any>(initialRecipe);
  
  const BASE_SERVINGS = 4;
  const [servings, setServings] = useState(BASE_SERVINGS);
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // === MAGIA DO MODO COZINHA (TELA CHEIA + PAISAGEM) ===
  const startCooking = async () => {
    setCurrentStep(0);
    setIsCookingMode(true);
    
    // Tenta forçar Tela Cheia e virar o celular de lado
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
  // ====================================================

  const handleDelete = async () => {
    const confirmDelete = confirm("Tem certeza que deseja excluir esta receita?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/recipes/${recipeId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push("/cookbook");
        router.refresh(); 
      } else {
        alert("Erro ao excluir a receita.");
      }
    } catch (error) {
      console.error("Erro na exclusão", error);
    }
  };

  const scaleIngredient = (text: string) => {
    const multiplier = servings / BASE_SERVINGS;
    if (multiplier === 1) return text;
    const regex = /^(\d+[\.,]?\d*)/;
    return text.replace(regex, (match) => {
      const num = parseFloat(match.replace(',', '.'));
      if (isNaN(num)) return match;
      const calculated = num * multiplier;
      return calculated.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    });
  };

  if (!recipe) return <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">Carregando...</div>;

  // 🍳 TELA DO MODO DE COZIMENTO (Full Screen)
  if (isCookingMode) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#1C1B19] text-[#FAF8F5] flex flex-col font-sans animate-in fade-in duration-300">
        <div className="flex justify-between items-center p-4 md:p-8 border-b border-[#2A2927]">
          <span className="text-lg md:text-xl font-serif text-[#D4A373] truncate pr-4">{cleanText(recipe.name)}</span>
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
            {cleanText(recipe.instructions[currentStep])}
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

  // 📄 TELA NORMAL RESPONSIVA
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans text-[#2A2927]">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-12">
        <Link href="/cookbook" className="text-[10px] font-bold text-[#8A857F] tracking-[0.15em] uppercase flex items-center gap-2 mb-8 hover:text-[#9C4A3A] transition-colors w-fit">
          <span>←</span> VOLTAR AO LIVRO
        </Link>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-12 md:mb-16 items-center">
          <div className="flex-1 w-full">
            <p className="text-[10px] font-bold text-[#9C4A3A] tracking-[0.15em] uppercase mb-4">IMPORTADO</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 md:mb-6 leading-tight">{cleanText(recipe.name)}</h1>
            <p className="text-[#6B6661] text-sm leading-relaxed mb-6 md:mb-8">
              {cleanText(recipe.description) || "Receita importada estruturada perfeitamente para o seu livro."}
            </p>
            
            <div className="flex items-center gap-4 text-xs font-mono text-[#8A857F] mb-6 md:mb-8 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {recipe.prepTime || "60 min"} total
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={startCooking}
                className="bg-[#9C4A3A] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#823B2E] transition-colors flex justify-center items-center gap-2 w-full sm:w-auto"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path><line x1="6" y1="17" x2="18" y2="17"></line></svg>
                Modo Cozinha
              </button>
              <button onClick={handleDelete} className="border border-[#FCA5A5] text-[#EF4444] px-6 py-3 rounded-full text-sm font-medium hover:bg-red-50 transition-colors flex justify-center items-center gap-2 w-full sm:w-auto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                Excluir
              </button>
            </div>
          </div>

          <div className="w-full md:w-5/12 h-[250px] sm:h-[300px] md:h-[400px] bg-[#EAE6DF] rounded-[2rem] overflow-hidden shadow-sm">
            {recipe.image ? <img src={recipe.image} alt={cleanText(recipe.name)} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm text-[#8A857F]">Sem Imagem</div>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
          <div className="col-span-1 md:col-span-5">
            <div className="flex flex-row items-center justify-between border-b border-[#EAE6DF] pb-4 mb-6">
              <h3 className="text-[10px] font-bold text-[#9C4A3A] tracking-[0.15em] uppercase">INGREDIENTES</h3>
              <div className="flex items-center bg-white border border-[#EAE6DF] rounded-full px-3 py-1 shadow-sm text-sm">
                <button onClick={() => setServings(Math.max(1, servings - 1))} className="text-[#8A857F] hover:text-[#9C4A3A] px-2 text-lg leading-none">−</button>
                <span className="font-medium mx-2 text-[#9C4A3A] w-12 text-center">{servings} <span className="text-[#2A2927] font-normal text-[10px]">porções</span></span>
                <button onClick={() => setServings(servings + 1)} className="text-[#8A857F] hover:text-[#9C4A3A] px-2 text-lg leading-none">+</button>
              </div>
            </div>

            <ul className="space-y-0">
              {recipe.ingredients.map((ing: string, index: number) => (
                <li key={index} className="flex items-start border-b border-[#EAE6DF] py-4 last:border-0">
                  <span className="text-[10px] font-bold text-[#9C4A3A] mr-4 md:mr-6 mt-1 w-4">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-[#2A2927] leading-relaxed transition-all duration-300">
                    {scaleIngredient(cleanText(ing))}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-7">
            <div className="border-b border-[#EAE6DF] pb-4 mb-6">
              <h3 className="text-[10px] font-bold text-[#8A857F] tracking-[0.15em] uppercase">MÉTODO</h3>
            </div>
            <div className="space-y-8 md:space-y-10 mt-8">
              {recipe.instructions.map((step: string, index: number) => (
                <div key={index} className="flex gap-4 md:gap-6">
                  <span className="text-3xl md:text-4xl font-serif italic text-[#D4A373] mt-[-6px]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm md:text-[15px] text-[#2A2927] leading-relaxed">
                    {cleanText(step)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}