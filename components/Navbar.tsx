"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const pathname = usePathname();

  const getLinkStyle = (path: string) => {
    return pathname.startsWith(path) 
      ? "text-[#9C4A3A]" 
      : "text-[#5A5651] hover:text-[#9C4A3A]";
  };

  useEffect(() => {
    const isLogged = localStorage.getItem("recipeHub_logged");
    if (isLogged === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("recipeHub_logged");
    setIsLoggedIn(false);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <nav className="relative flex items-center justify-between px-6 md:px-16 py-6 border-b border-[#EAE6DF] text-[#2A2927]">
      <Link href="/" className="text-2xl font-serif tracking-tight cursor-pointer z-50">
        Receita<span className="text-[#9C4A3A]">.</span>Hub
      </Link>

      {/* MENU DESKTOP */}
      {isLoggedIn ? (
        <div className="hidden md:flex items-center gap-10 text-[11px] font-semibold tracking-[0.15em] uppercase">
          <Link href="/cookbook" className={`${getLinkStyle('/cookbook')} transition-colors`}>Livro de Receitas</Link>
          <Link href="/import" className={`${getLinkStyle('/import')} transition-colors`}>Importar</Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-[#5A5651] hover:text-[#9C4A3A] transition-colors ml-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Sair
          </button>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.15em] uppercase text-[#5A5651]">
          <Link href="/login" className="hover:text-[#9C4A3A] transition-colors">Entrar</Link>
          <Link href="/join" className="bg-[#9C4A3A] text-[#FAF8F5] px-6 py-2.5 rounded-full hover:bg-[#823B2E] transition-colors">Cadastrar</Link>
        </div>
      )}

      {/* BOTÃO MENU MOBILE */}
      <button 
        className="md:hidden z-50 text-[#2A2927]"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        )}
      </button>

      {/* MENU MOBILE EXPANSÍVEL */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#FAF8F5] border-b border-[#EAE6DF] shadow-lg flex flex-col px-6 py-6 gap-6 md:hidden z-40 text-sm font-semibold tracking-[0.15em] uppercase">
          {isLoggedIn ? (
            <>
              <Link href="/cookbook" onClick={() => setIsMenuOpen(false)} className={getLinkStyle('/cookbook')}>Livro de Receitas</Link>
              <Link href="/import" onClick={() => setIsMenuOpen(false)} className={getLinkStyle('/import')}>Importar</Link>
              <hr className="border-[#EAE6DF]" />
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-[#5A5651]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-[#5A5651]">Entrar</Link>
              <Link href="/join" onClick={() => setIsMenuOpen(false)} className="text-[#9C4A3A]">Cadastrar</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}