interface CardProps {
  number: string;
  tag: string;
  title: string;
  description: string;
}

function FeatureCard({ number, tag, title, description }: CardProps) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-[#EAE6DF] flex flex-col justify-between min-h-[220px]">
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
        <p className="text-xs font-semibold text-[#9C4A3A] tracking-widest uppercase mb-3">The Kitchen</p>
        <h3 className="text-4xl font-serif text-[#2A2927]">Built for hands that are already busy.</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FeatureCard 
          number="01" 
          tag="Import" 
          title="Any URL becomes yours" 
          description="Paste a recipe link. We parse JSON-LD or fall back to smart heuristics. Ingredients, steps, timings — all structured."
        />
        <FeatureCard 
          number="02" 
          tag="Servings" 
          title="Recalculated live" 
          description="Slide from 4 to 2 servings — every gram, cup and pinch updates in place. Flour, on the fly."
        />
        <FeatureCard 
          number="03" 
          tag="Pantry Search" 
          title="What can I cook tonight?" 
          description="Type what you have. We rank your saved recipes by ingredient overlap. Waste less, taste more."
        />
        <FeatureCard 
          number="04" 
          tag="Chef AI" 
          title="Adapt to any diet" 
          description="Ask for vegan, gluten-free or a swap for eggs. Claude 4.5 drafts the substitution in seconds."
        />
      </div>
    </section>
  );
}