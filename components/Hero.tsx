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
        
        <div className="flex flex-wrap gap-4">
          <Link href="/join" className="bg-[#9C4A3A] text-[#FAF8F5] px-8 py-3.5 rounded-full font-medium hover:bg-[#823B2E] transition text-sm flex items-center gap-2 shadow-sm">
            Comece o seu livro <span className="text-base">→</span>
          </Link>
          <Link href="/login" className="border border-[#CDCECA] px-8 py-3.5 rounded-full font-medium hover:bg-[#F2EFEA] transition text-sm text-[#2A2927] flex items-center">
            Já tenho uma conta
          </Link>
        </div>
      </div>

      {/* Grid de Imagens Mosaico (De volta aos placeholders) */}
      <div className="grid grid-cols-2 gap-4 h-[450px]">
        <div className="bg-[#EAE6DF] rounded-2xl h-full w-full flex items-center justify-center text-xs text-gray-400 font-mono shadow-sm">
          [Imagem Principal]
        </div>
        <div className="grid grid-rows-2 gap-4 h-full">
          <div className="bg-[#EAE6DF] rounded-2xl flex items-center justify-center text-xs text-gray-400 font-mono shadow-sm">
            [Imagem Secundária 1]
          </div>
          <div className="bg-[#EAE6DF] rounded-2xl flex items-center justify-center text-xs text-gray-400 font-mono shadow-sm">
            [Imagem Secundária 2]
          </div>
        </div>
      </div>
    </section>
  );
}