'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Copy, Link as LinkIcon, Loader2, MessageSquare, RefreshCcw, ShieldCheck } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session, status } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (status === 'loading') {
    return <DashboardSkeleton />;
  }

  if (!session || !session.user) {
    return null;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 p-4 md:p-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-indigo-600">Your workspace</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Welcome back, {username}</h1>
          <p className="mt-2 text-muted-foreground">Manage your anonymous-message board in one place.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          Profile active
        </span>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="rounded-lg bg-indigo-100 p-3 text-indigo-700"><LinkIcon className="h-5 w-5" /></span>
            <div><p className="text-sm text-muted-foreground">Public profile</p><p className="font-semibold">@{username}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="rounded-lg bg-sky-100 p-3 text-sky-700"><MessageSquare className="h-5 w-5" /></span>
            <div><p className="text-sm text-muted-foreground">Messages received</p><p className="font-semibold">{messages.length}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div><p className="text-sm text-muted-foreground">Receiving messages</p><p className="font-semibold">{acceptMessages ? 'Enabled' : 'Paused'}</p></div>
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              aria-label="Toggle anonymous messages"
            />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Your shareable link</h2><Button onClick={copyToClipboard} size="sm"><Copy className="mr-2 h-4 w-4" />Copy</Button></div>
          <input type="text" value={profileUrl} disabled className="w-full rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground" />
        </CardContent>
      </Card>

      <Separator />

      <section>
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-xl font-bold">Inbox</h2><p className="text-sm text-muted-foreground">Your latest anonymous messages.</p></div><Button aria-label="Refresh inbox" onClick={() => fetchMessages(true)} size="icon" title="Refresh inbox" variant="outline">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}</Button></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <Card className="md:col-span-2"><CardContent className="py-12 text-center text-muted-foreground">No messages yet. Share your public link to start receiving feedback.</CardContent></Card>
        )}
      </div>
      </section>
    </main>
  );
}

function DashboardSkeleton() {
  return <main className="mx-auto w-full max-w-6xl space-y-8 p-4 md:p-8"><div className="space-y-3"><div className="h-4 w-28 animate-pulse rounded bg-muted" /><div className="h-10 w-72 animate-pulse rounded bg-muted" /></div><div className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => <div className="h-28 animate-pulse rounded-lg bg-muted" key={item} />)}</div><div className="h-32 animate-pulse rounded-lg bg-muted" /><div className="grid gap-4 md:grid-cols-2">{[1, 2].map((item) => <div className="h-40 animate-pulse rounded-lg bg-muted" key={item} />)}</div></main>;
}

export default UserDashboard;
