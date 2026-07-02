"use client";

import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro ao criar a conta.");
      }

      // Conta criada com sucesso! Redireciona para o login
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout imagePosition="left">
      <div className="mb-10">
        <p className="text-[10px] font-bold text-[#9C4A3A] tracking-[0.15em] uppercase mb-4">
          Criar conta
        </p>
        <h1 className="text-4xl md:text-5xl font-serif font-light text-[#2A2927] leading-[1.1]">
          Cada receita que ama, <br />
          <span className="italic">organizada.</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-[#8A857F] tracking-[0.15em] uppercase mb-2">
            Seu Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-transparent border-b border-[#EAE6DF] py-2 outline-none focus:border-[#9C4A3A] transition-colors text-[#2A2927]"
          />
        </div>

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
            Senha (Mín. 6 caracteres)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-transparent border-b border-[#EAE6DF] py-2 outline-none focus:border-[#9C4A3A] transition-colors text-[#2A2927]"
          />
        </div>

        {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#9C4A3A] text-[#FAF8F5] py-4 rounded-full font-medium hover:bg-[#823B2E] transition-colors mt-8 disabled:opacity-50"
        >
          {isLoading ? "A criar conta..." : "Começar a cozinhar"}
        </button>
      </form>

      <p className="text-xs text-[#8A857F] mt-6">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-[#9C4A3A] hover:underline">
          Fazer Login
        </Link>
      </p>
    </AuthLayout>
  );
}