export default function CookingMode() {
  return (
    <section className="bg-[#1C1B19] text-[#FAF8F5] py-20 px-8 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Bloco da Imagem Atualizado com nova URL */}
        <div className="bg-[#2A2927] rounded-2xl h-[320px] shadow-sm relative overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&q=80&w=800" 
            alt="Mãos preparando massa com farinha na bancada da cozinha" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-90"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-[#D4A373] tracking-widest uppercase mb-4">Modo Cozinha</p>
          <h3 className="text-4xl md:text-5xl font-serif font-light mb-6 leading-tight">
            Texto grande. <br />Sabor maior.
          </h3>
          <p className="text-[#A5A19C] text-sm leading-relaxed mb-8 max-w-md">
            O Modo Cozinha transforma o seu celular num assistente de bancada. 
            Um passo de cada vez, com letras gigantes, para você conseguir ler mesmo com as mãos sujas de farinha. 
            Sem pop-ups, sem anúncios, sem se perder na tela.
          </p>
          <button className="text-sm font-semibold tracking-widest uppercase border-b border-[#FAF8F5] pb-1 hover:text-[#D4A373] hover:border-[#D4A373] transition">
            Testar Modo Cozinha →
          </button>
        </div>
      </div>
    </section>
  );
}