'use client';

import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';

export default function OnboardingPage() {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/sign-in');
    } else if (status === 'authenticated' && !session.user.needsUsernameSetup) {
      router.replace('/dashboard');
    }
  }, [router, session, status]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse & { username: string }>(
        '/api/complete-oauth-profile',
        { username }
      );

      await update({
        username: response.data.username,
        needsUsernameSetup: false,
      });
      router.replace('/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Unable to save username',
        description:
          axiosError.response?.data.message ?? 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || !session?.user.needsUsernameSetup) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-800 p-4">
      <section className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <div>
          <h1 className="text-3xl font-bold">Choose your username</h1>
          <p className="mt-2 text-sm text-gray-600">
            This will be used in your public anonymous-message link.
          </p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="username"
            minLength={2}
            maxLength={20}
            pattern="[a-zA-Z0-9_]+"
            required
          />
          <p className="text-sm text-gray-500">
            Use 2–20 letters, numbers, or underscores.
          </p>
          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Saving…' : 'Continue'}
          </Button>
        </form>
      </section>
    </main>
  );
}
