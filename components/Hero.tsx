export default function Hero() {
  return (
    <section className="px-8 md:px-16 py-16 md:py-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div>
        <p className="text-xs font-semibold text-[#9C4A3A] tracking-widest uppercase mb-6">
          Issue N°01 — A cookbook, but yours
        </p>
        <h2 className="text-5xl md:text-7xl font-serif font-light leading-[1.1] mb-8 tracking-tight">
          A cookbook that <br /> remembers <br /> every taste <br /> you love.
        </h2>
        <p className="text-base text-[#6B6661] mb-10 max-w-md leading-relaxed">
          Paste a link, save the flavour. Recipe Hub scrapes any recipe on the web, 
          recalculates portions in real-time, and adapts to your diet with a chef in the machine.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button className="bg-[#9C4A3A] text-[#FAF8F5] px-8 py-3.5 rounded-full font-medium hover:bg-[#823B2E] transition text-sm flex items-center gap-2 shadow-sm">
            Start your cookbook <span className="text-base">→</span>
          </button>
          <button className="border border-[#CDCECA] px-8 py-3.5 rounded-full font-medium hover:bg-[#F2EFEA] transition text-sm text-[#2A2927]">
            Already have one
          </button>
        </div>
      </div>

      {/* Grid de Imagens Mosaico (Usando placeholders estilizados por enquanto) */}
      <div className="grid grid-cols-2 gap-4 h-[450px]">
        <div className="bg-[#EAE6DF] rounded-2xl h-full w-full flex items-center justify-center text-xs text-gray-400 font-mono">
          [Imagem Principal]
        </div>
        <div className="grid grid-rows-2 gap-4 h-full">
          <div className="bg-[#EAE6DF] rounded-2xl flex items-center justify-center text-xs text-gray-400 font-mono">
            [Imagem Secundária 1]
          </div>
          <div className="bg-[#EAE6DF] rounded-2xl flex items-center justify-center text-xs text-gray-400 font-mono">
            [Imagem Secundária 2]
          </div>
        </div>
      </div>
    </section>
  );
}