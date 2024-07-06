import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";
import { signInSchema } from "./zod"; // Assurez-vous que le schéma Zod est correctement configuré
// const locale = useLocale();
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("trying credentials signIn", credentials);
        try {
          const parsedData = await signInSchema.parseAsync(credentials);

          if (
            typeof parsedData.email !== "string" ||
            typeof parsedData.password !== "string"
          ) {
            console.log("Invalid credentials");
            throw new Error("Invalid credentials");
          }

          console.log("parsedData", parsedData);
          const user = await db.user.findUnique({
            where: { email: parsedData.email ?? "" },
          });

          if (user && (await compare(parsedData.password, user.password))) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }

          console.log("Invalid email or password");
          throw new Error("Invalid email or password");
        } catch (error: any) {
          console.error("Error in authorize:", error);
          if (error.name === "ZodError") {
            throw new Error("Validation error");
          }
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  // pages: {
  //   signIn: `/${locale}/sign-in`,
  // },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session?.user };
      }
      if (user) {
        token.name = user.name || "";
        token.email = user.email || "";
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.name = token.name || "";
      session.user.email = token.email || "";
      session.user.role = token.role || "user";
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
});
