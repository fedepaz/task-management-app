import type { AuthConfig } from "@auth/core";
import GithubProvider from "@auth/core/providers/github";
import GoogleProvider from "@auth/core/providers/google";

export const authProviders = [
  GithubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
  }),
];
