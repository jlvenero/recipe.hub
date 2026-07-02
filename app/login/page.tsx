"use client";

import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Chama a nossa API de autenticação estruturada com o Prisma
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou senha incorretos. Verifique os dados.");
      setIsLoading(false);
    } else {
      // Sincroniza a Navbar localmente e vai direto para o Livro de Receitas
      localStorage.setItem("recipeHub_logged", "true");
      router.push("/cookbook");
    }
  };

  return (
    <AuthLayout imagePosition="right">
      <div className="mb-10">
        <p className="text-[10px] font-bold text-[#9C4A3A] tracking-[0.15em] uppercase mb-4">
          Entrar
        </p>
        <h1 className="text-4xl md:text-5xl font-serif font-light text-[#2A2927]">
          De volta ao <span className="italic">fogão.</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-[#8A857F] tracking-[0.15em] uppercase mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border-b border-[#EAE6DF] py-2 outline-none focus:border-[#9C4A3A] transition-colors text-[#2A2927]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#8A857F] tracking-[0.15em] uppercase mb-2">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-transparent border-b border-[#EAE6DF] py-2 outline-none focus:border-[#9C4A3A] transition-colors text-[#2A2927]"
          />
        </div>

        {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#9C4A3A] text-[#FAF8F5] py-4 rounded-full font-medium hover:bg-[#823B2E] transition-colors mt-8 disabled:opacity-50"
        >
          {isLoading ? "A verificar..." : "Entrar"}
        </button>
      </form>

      <p className="text-xs text-[#8A857F] mt-6">
        Ainda não tem conta?{" "}
        <Link href="/join" className="text-[#9C4A3A] hover:underline">
          Criar uma conta
        </Link>
      </p>
    </AuthLayout>
  );
}