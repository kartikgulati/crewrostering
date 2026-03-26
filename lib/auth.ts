import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
const fallbackPassword = process.env.ADMIN_PASSWORD ?? "ChangeThis123!";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        if (credentials.email !== adminEmail) return null;

        const envHash = process.env.ADMIN_PASSWORD_HASH;
        const validPassword = envHash
          ? await bcrypt.compare(credentials.password, envHash)
          : credentials.password === fallbackPassword;

        if (!validPassword) return null;

        return {
          id: "admin",
          email: adminEmail,
          name: "Launch Admin",
          role: "admin",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role ?? "admin";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};
