"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function RecipeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  // Estados da Receita
  const [recipe, setRecipe] = useState<any>(null);
  
  // Estados da Matemática (Porções)
  const BASE_SERVINGS = 4; // Assumimos que a receita padrão serve 4 pessoas
  const [servings, setServings] = useState(BASE_SERVINGS);
  
  // Estados do Modo de Cozimento
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem("recipeHub_cookbook") || "[]");
    const foundRecipe = savedRecipes.find((r: any) => r.id === params.id);
    
    if (foundRecipe) setRecipe(foundRecipe);
    else router.push("/cookbook");
  }, [params.id, router]);

  const handleDelete = () => {
    const savedRecipes = JSON.parse(localStorage.getItem("recipeHub_cookbook") || "[]");
    const updatedRecipes = savedRecipes.filter((r: any) => r.id !== params.id);
    localStorage.setItem("recipeHub_cookbook", JSON.stringify(updatedRecipes));
    router.push("/cookbook");
  };

  // 🧮 FUNÇÃO MÁGICA DA MATEMÁTICA
  const scaleIngredient = (text: string) => {
    const multiplier = servings / BASE_SERVINGS;
    if (multiplier === 1) return text; // Se for 4 porções, não muda nada

    // Procura o primeiro número no início do texto (ex: "2", "1.5", "500")
    const regex = /^(\d+[\.,]?\d*)/;
    
    return text.replace(regex, (match) => {
      const num = parseFloat(match.replace(',', '.')); // Garante que lê decimais corretamente
      if (isNaN(num)) return match;
      
      // Multiplica e formata de volta para não ficar com muitas casas decimais
      const calculated = num * multiplier;
      return calculated.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    });
  };

  if (!recipe) return <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">Carregando...</div>;

  // 🍳 TELA DO MODO DE COZIMENTO (Full Screen)
  if (isCookingMode) {
    return (
      <div className="fixed inset-0 z-50 bg-[#1C1B19] text-[#FAF8F5] flex flex-col font-sans animate-in fade-in duration-300">
        
        {/* Cabeçalho do Modo Cozimento */}
        <div className="flex justify-between items-center p-8 border-b border-[#2A2927]">
          <span className="text-xl font-serif text-[#D4A373] truncate pr-4">{recipe.name}</span>
          <button 
            onClick={() => setIsCookingMode(false)} 
            className="text-[#8A857F] hover:text-white flex items-center gap-2 text-sm tracking-widest uppercase font-bold"
          >
            ✕ Sair da Cozinha
          </button>
        </div>

        {/* Conteúdo Central (Passo a Passo) */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 text-center relative">
          <p className="text-[#D4A373] tracking-[0.2em] text-sm font-bold uppercase mb-8">
            Passo {currentStep + 1} de {recipe.instructions.length}
          </p>
          
          <h2 className="text-4xl md:text-7xl font-serif font-light leading-tight max-w-5xl">
            {recipe.instructions[currentStep]}
          </h2>

          {/* Navegação Inferior (Botões Gigantes) */}
          <div className="absolute bottom-12 w-full flex justify-between px-8 md:px-24">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="text-lg md:text-2xl font-serif italic text-[#8A857F] hover:text-white disabled:opacity-20 transition-colors"
            >
              ← Anterior
            </button>
            <button
              disabled={currentStep === recipe.instructions.length - 1}
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="text-lg md:text-2xl font-serif italic text-[#D4A373] hover:text-white disabled:opacity-20 transition-colors"
            >
              Próximo →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 📄 TELA NORMAL (Detalhes da Receita)
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans text-[#2A2927]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-8 py-12 w-full">
        <Link href="/cookbook" className="text-[10px] font-bold text-[#8A857F] tracking-[0.15em] uppercase flex items-center gap-2 mb-8 hover:text-[#9C4A3A] transition-colors w-fit">
          <span>←</span> VOLTAR AO LIVRO DE RECEITAS
        </Link>

        {/* SEÇÃO SUPERIOR */}
        <div className="flex flex-col md:flex-row gap-12 mb-16 items-center">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-[#9C4A3A] tracking-[0.15em] uppercase mb-4">IMPORTADO</p>
            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">{recipe.name}</h1>
            <p className="text-[#6B6661] text-sm leading-relaxed mb-8">
              {recipe.description || "Esta receita foi importada e estruturada perfeitamente para o seu livro de receitas. Aproveite cada etapa do preparo com ingredientes precisos."}
            </p>
            
            <div className="flex items-center gap-4 text-xs font-mono text-[#8A857F] mb-8 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {recipe.prepTime || "60 min"} total mínimo
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Botão que ativa o Modo Cozimento */}
              <button 
                onClick={() => {
                  setCurrentStep(0); // Garante que começa no passo 1
                  setIsCookingMode(true);
                }}
                className="bg-[#9C4A3A] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#823B2E] transition-colors flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path><line x1="6" y1="17" x2="18" y2="17"></line></svg>
                Modo de cozimento
              </button>
              <button onClick={handleDelete} className="border border-[#FCA5A5] text-[#EF4444] px-6 py-3 rounded-full text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                Excluir
              </button>
            </div>
          </div>

          <div className="w-full md:w-5/12 h-[400px] bg-[#EAE6DF] rounded-[2rem] overflow-hidden shadow-sm">
            {recipe.image ? <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm text-[#8A857F]">Sem Imagem</div>}
          </div>
        </div>

        {/* SEÇÃO INFERIOR */}
        <div className="grid md:grid-cols-12 gap-12 md:gap-20">
          
          {/* Ingredientes Dinâmicos */}
          <div className="md:col-span-5">
            <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-4 mb-6">
              <h3 className="text-[10px] font-bold text-[#9C4A3A] tracking-[0.15em] uppercase">INGREDIENTES</h3>
              <div className="flex items-center bg-white border border-[#EAE6DF] rounded-full px-4 py-1.5 shadow-sm text-sm">
                <button onClick={() => setServings(Math.max(1, servings - 1))} className="text-[#8A857F] hover:text-[#9C4A3A] px-2 text-lg leading-none">−</button>
                <span className="font-medium mx-3 text-[#9C4A3A] w-16 text-center">{servings} <span className="text-[#2A2927] font-normal text-xs">porções</span></span>
                <button onClick={() => setServings(servings + 1)} className="text-[#8A857F] hover:text-[#9C4A3A] px-2 text-lg leading-none">+</button>
              </div>
            </div>

            <ul className="space-y-0">
              {recipe.ingredients.map((ing: string, index: number) => (
                <li key={index} className="flex items-start border-b border-[#EAE6DF] py-4 last:border-0">
                  <span className="text-[10px] font-bold text-[#9C4A3A] mr-6 mt-1 w-4">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-[#2A2927] leading-relaxed transition-all duration-300">
                    {/* Aqui chamamos a função que recalcula o valor */}
                    {scaleIngredient(ing)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Método */}
          <div className="md:col-span-7">
            <div className="border-b border-[#EAE6DF] pb-4 mb-6">
              <h3 className="text-[10px] font-bold text-[#8A857F] tracking-[0.15em] uppercase">MÉTODO</h3>
            </div>
            <div className="space-y-10 mt-8">
              {recipe.instructions.map((step: string, index: number) => (
                <div key={index} className="flex gap-6">
                  <span className="text-4xl font-serif italic text-[#D4A373] mt-[-6px]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[15px] text-[#2A2927] leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}