import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

async function createPlaceholderUsername() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const username = `oauth_${randomBytes(7).toString('hex')}`;
    const existingUser = await UserModel.exists({ username });

    if (!existingUser) {
      return username;
    }
  }

  throw new Error('Unable to create an OAuth username');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider === 'credentials') {
        return true;
      }

      if (!user.email) {
        return '/sign-in?error=OAuthEmailMissing';
      }

      await dbConnect();

      let databaseUser = await UserModel.findOne({ email: user.email });

      if (!databaseUser) {
        databaseUser = await UserModel.create({
          username: await createPlaceholderUsername(),
          email: user.email,
          password: await bcrypt.hash(randomBytes(32).toString('hex'), 10),
          verifyCode: randomBytes(3).toString('hex'),
          verifyCodeExpiry: new Date(Date.now() + 3600000),
          isVerified: true,
          needsUsernameSetup: true,
          isAcceptingMessages: true,
          messages: [],
        });
      } else if (!databaseUser.isVerified) {
        databaseUser.isVerified = true;
        await databaseUser.save();
      }

      user._id = databaseUser._id.toString();
      user.username = databaseUser.username;
      user.isVerified = databaseUser.isVerified;
      user.isAcceptingMessages = databaseUser.isAcceptingMessages;
      user.needsUsernameSetup = databaseUser.needsUsernameSetup;

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
        token.needsUsernameSetup = user.needsUsernameSetup;
      }

      if (trigger === 'update') {
        const updates = session as {
          username?: string;
          needsUsernameSetup?: boolean;
        };
        token.username = updates.username ?? token.username;
        token.needsUsernameSetup =
          updates.needsUsernameSetup ?? token.needsUsernameSetup;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
        session.user.needsUsernameSetup = token.needsUsernameSetup;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};
