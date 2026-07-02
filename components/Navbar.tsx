"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Assim que a Navbar carrega, ela checa se você simulou o login
  useEffect(() => {
    const isLogged = localStorage.getItem("recipeHub_logged");
    if (isLogged === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem("recipeHub_logged", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("recipeHub_logged");
    setIsLoggedIn(false);
  };

  return (
    <nav className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-[#EAE6DF] text-[#2A2927]">
      <Link href="/" className="text-2xl font-serif tracking-tight cursor-pointer">
        Receita<span className="text-[#9C4A3A]">.</span>Hub
      </Link>

      {isLoggedIn ? (
        // MENU LOGADO (Em Português)
        <div className="hidden md:flex items-center gap-10 text-[11px] font-semibold tracking-[0.15em] uppercase text-[#5A5651]">
          <Link href="/cookbook" className="hover:text-[#9C4A3A] transition-colors">Livro de Receitas</Link>
          <Link href="/import" className="hover:text-[#9C4A3A] transition-colors">Importar</Link>
          <a href="#pantry" className="hover:text-[#9C4A3A] transition-colors">Despensa</a>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 hover:text-[#9C4A3A] transition-colors ml-4"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sair
          </button>
        </div>
      ) : (
        // MENU DESLOGADO
        <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.15em] uppercase text-[#5A5651]">
          <Link href="/login" className="hover:text-[#9C4A3A] transition-colors">
            Sign In
          </Link>
          <Link href="/join" className="bg-[#9C4A3A] text-[#FAF8F5] px-6 py-2.5 rounded-full hover:bg-[#823B2E] transition-colors">
            Join
          </Link>
        </div>
      )}
    </nav>
  );
}