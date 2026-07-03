// components/AuthLayout.tsx
import Navbar from "./Navbar";

interface AuthLayoutProps {
  children: React.ReactNode;
  imagePosition?: "left" | "right";
}

export default function AuthLayout({ children, imagePosition = "right" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col md:flex-row">
        
        {/* Se imagePosition for "left", renderiza o bloco da imagem primeiro */}
        {imagePosition === "left" && (
          <div className="hidden md:block md:w-1/2 bg-[#EAE6DF]">
             <div className="h-full w-full relative overflow-hidden group">
               <img 
                 src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200" 
                 alt="Salada fresca" 
                 className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
               />
             </div>
          </div>
        )}

        {/* Área do Formulário */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-24">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Se imagePosition for "right", renderiza o bloco da imagem depois */}
        {imagePosition === "right" && (
          <div className="hidden md:block md:w-1/2 bg-[#EAE6DF]">
             <div className="h-full w-full relative overflow-hidden group">
               <img 
                 src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200" 
                 alt="Ambiente escuro e prato sofisticado" 
                 className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
               />
             </div>
          </div>
        )}
      </main>
    </div>
  );
}