import { AuthConfig } from "@auth/core";
import { authProviders } from "./providers";
import { AuthUser } from "../types/auth";

declare module "@auth/core/types" {
  interface User {
    role?: "ADMIN" | "USER" | "GUEST";
  }
}

export const authConfig: AuthConfig = {
  providers: authProviders,
  callbacks: {
    async session({ session, token }) {
      const customSession = {
        ...session,
        user: {
          id: token.sub,
          email: session.user.email,
          name: session.user.name,
          role: token.role || "USER",
        } as AuthUser,
      };
      return customSession;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || "USER";
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
};
