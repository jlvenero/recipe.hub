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
             <div className="h-full w-full bg-neutral-300 flex items-center justify-center text-xs text-gray-500 font-mono">
               [Imagem de Salada (Esquerda)]
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
             <div className="h-full w-full bg-neutral-800 flex items-center justify-center text-xs text-gray-400 font-mono">
               [Imagem Escura (Direita)]
             </div>
          </div>
        )}
      </main>
    </div>
  );
}