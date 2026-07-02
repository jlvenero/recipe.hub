export default function CookingMode() {
  return (
    <section className="bg-[#1C1B19] text-[#FAF8F5] py-20 px-8 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="bg-[#2A2927] rounded-2xl h-[320px] flex items-center justify-center text-xs text-gray-600 font-mono">
          [Imagem Modo Cozinha]
        </div>
        <div>
          <p className="text-xs font-semibold text-[#D4A373] tracking-widest uppercase mb-4">Cooking Mode</p>
          <h3 className="text-4xl md:text-5xl font-serif font-light mb-6 leading-tight">
            Big text. <br />Bigger flavour.
          </h3>
          <p className="text-[#A5A19C] text-sm leading-relaxed mb-8 max-w-md">
            Cooking Mode turns your phone into a hands-free counter buddy. 
            One step at a time, in editorial-size type, with timers you can start 
            with a floury knuckle. No pop-ups, no ads, no scrolling maze.
          </p>
          <button className="text-sm font-semibold tracking-widest uppercase border-b border-[#FAF8F5] pb-1 hover:text-[#D4A373] hover:border-[#D4A373] transition">
            Try Cooking Mode →
          </button>
        </div>
      </div>
    </section>
  );
}