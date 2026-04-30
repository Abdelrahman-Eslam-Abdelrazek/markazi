import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/center") ||
        nextUrl.pathname.startsWith("/courses") ||
        nextUrl.pathname.startsWith("/students") ||
        nextUrl.pathname.startsWith("/payments") ||
        nextUrl.pathname.startsWith("/attendance") ||
        nextUrl.pathname.startsWith("/exams") ||
        nextUrl.pathname.startsWith("/my-");

      if (isOnDashboard) {
        return isLoggedIn;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
};
