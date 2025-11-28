import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcrypt";

import type { AuthOptions, SessionStrategy } from "next-auth";

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    // 🟦 Login con Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),

    // 🟩 Login normal con correo/usuario + contraseña
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: { label: "Usuario o Email", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },

      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();

        // Buscar usuario por correo o username
        const user = await db
          .collection("users")
          .findOne({
            $or: [
              { email: credentials?.email },
              { username: credentials?.email }, // por si usas username
            ],
          });

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        // Validar contraseña
        const isValidPassword = await compare(
          credentials!.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt" as SessionStrategy,
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, profile }) {
      // capture Google profile picture and set default role on first OAuth login
      if (profile) {
        const client = await clientPromise
        const db = client.db()
        const existingUser = await db.collection('users').findOne({ email: user.email })
        
        // In Google OAuth, picture is in profile.picture, not profile.image
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const googleImage = (profile as any)?.picture || user.image || '/default-avatar.svg'
        
        if (!existingUser) {
          // new user from OAuth: set image from profile and default role
          await db.collection('users').updateOne(
            { email: user.email },
            {
              $set: {
                image: googleImage,
                role: 'user',
              },
            },
            { upsert: true }
          )
        } else if (!existingUser.image) {
          // existing user without image: update with OAuth image
          await db.collection('users').updateOne(
            { email: user.email },
            { $set: { image: googleImage, role: 'user' } }
          )
        }
      }
      return true
    },
    async redirect({ baseUrl }) {
      // redirect to home after successful login instead of callback URL
      return baseUrl
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
