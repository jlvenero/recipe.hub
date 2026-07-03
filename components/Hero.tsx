import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-8 md:px-16 py-16 md:py-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div>
        <p className="text-xs font-semibold text-[#9C4A3A] tracking-widest uppercase mb-6">
          Edição N°01 — Um livro, mas com a sua cara
        </p>
        <h2 className="text-5xl md:text-7xl font-serif font-light leading-[1.1] mb-8 tracking-tight">
          Um livro de <br /> receitas que <br /> lembra de cada <br /> sabor que você ama.
        </h2>
        <p className="text-base text-[#6B6661] mb-10 max-w-md leading-relaxed">
          Cole um link, salve o sabor. O Recipe.Hub extrai qualquer receita da web, 
          recalcula as porções em tempo real e adapta-se à sua dieta com uma IA Chef integrada.
        </p>
        
        {/* Nova disposição dos botões */}
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/join" className="bg-[#9C4A3A] text-[#FAF8F5] px-8 py-3.5 rounded-full font-medium hover:bg-[#823B2E] transition text-sm flex items-center gap-2 shadow-sm">
            Comece o seu livro <span className="text-base">→</span>
          </Link>
          <Link href="/guest" className="border border-[#CDCECA] bg-white px-8 py-3.5 rounded-full font-medium hover:bg-[#F2EFEA] transition text-sm text-[#2A2927] flex items-center shadow-sm">
            Testar sem conta
          </Link>
          <Link href="/login" className="text-sm font-medium text-[#8A857F] hover:text-[#2A2927] hover:underline underline-offset-4 transition px-2">
            Já tenho conta
          </Link>
        </div>
      </div>

      {/* Grid de Imagens Mosaico */}
      <div className="grid grid-cols-2 gap-4 h-[450px]">
        
        {/* Imagem Principal (Esquerda) */}
        <div className="rounded-2xl h-full w-full overflow-hidden relative group bg-[#EAE6DF]">
          <img 
            src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800" 
            alt="Prato saudável e colorido" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
        </div>

        {/* Coluna da Direita (2 Imagens Secundárias) */}
        <div className="grid grid-rows-2 gap-4 h-full">
          
          <div className="rounded-2xl h-full w-full overflow-hidden relative group bg-[#EAE6DF]">
            <img 
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800" 
              alt="Preparando ingredientes na cozinha" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          </div>

          <div className="rounded-2xl h-full w-full overflow-hidden relative group bg-[#EAE6DF]">
            <img 
              src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&q=80&w=800" 
              alt="Mesa de comida farta" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          </div>

        </div>
      </div>
    </section>
  );
}