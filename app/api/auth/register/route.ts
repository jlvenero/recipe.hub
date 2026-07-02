import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios." }, { status: 400 });
    }

    // Verifica se o email já existe no Neon
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Este email já está em uso." }, { status: 400 });
    }

    // Encripta a senha e salva o utilizador no banco
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });

    return NextResponse.json({ message: "Conta criada com sucesso!" });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao criar conta." }, { status: 500 });
  }
}