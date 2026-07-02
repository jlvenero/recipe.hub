interface CardProps {
  number: string;
  tag: string;
  title: string;
  description: string;
}

function FeatureCard({ number, tag, title, description }: CardProps) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-[#EAE6DF] flex flex-col justify-between min-h-[220px] hover:shadow-md transition-shadow">
      <div>
        <p className="text-[10px] font-bold text-[#9C4A3A] tracking-widest uppercase mb-4 flex items-center gap-1.5">
          <span>→</span> {number} · {tag}
        </p>
        <h4 className="text-2xl font-serif font-normal text-[#2A2927] mb-3">{title}</h4>
      </div>
      <p className="text-sm text-[#6B6661] leading-relaxed">{description}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section className="px-8 md:px-16 py-20 max-w-7xl mx-auto border-t border-[#EAE6DF]">
      <div className="mb-12">
        <p className="text-xs font-semibold text-[#9C4A3A] tracking-widest uppercase mb-3">A Cozinha</p>
        <h3 className="text-4xl font-serif text-[#2A2927]">Feito para mãos que já estão ocupadas.</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FeatureCard 
          number="01" 
          tag="Importação" 
          title="Qualquer site vira seu" 
          description="Cole o link de uma receita. Nós extraímos os dados de forma inteligente. Ingredientes, passo a passo e tempo — tudo limpo e estruturado."
        />
        <FeatureCard 
          number="02" 
          tag="Porções" 
          title="Matemática ao vivo" 
          description="Deslize de 4 para 2 porções — cada grama, xícara e pitada se atualiza na hora na sua tela. Tudo sob medida."
        />
        <FeatureCard 
          number="03" 
          tag="Despensa" 
          title="O que tem para o jantar?" 
          description="Digite o que você tem na geladeira. Nós filtramos suas receitas salvas pelas combinações perfeitas. Menos desperdício, mais sabor."
        />
        <FeatureCard 
          number="04" 
          tag="Chef IA" 
          title="Adapte a qualquer dieta" 
          description="Peça uma versão vegana, sem glúten ou substitua laticínios. A inteligência artificial cria a adaptação exata em segundos."
        />
      </div>
    </section>
  );
}