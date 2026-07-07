// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Importando as configurações do novo arquivo

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };