"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type RealtimeCallback<T = unknown> = (payload: T) => void;

export function useRealtime<T = unknown>(
  channel: string,
  event: string,
  table: string,
  callback: RealtimeCallback<T>,
) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    const supabase = createClient();
    const sub = supabase
      .channel(channel)
      .on("postgres_changes" as any, { event: event as any, schema: "public", table }, (payload: any) => {
        cbRef.current(payload as T);
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, [channel, event, table]);
}

export function useRealtimeChannel<T = unknown>(
  channelName: string,
  callback: RealtimeCallback<T>,
  filter?: Record<string, string>,
) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(channelName);

    if (filter) {
      channel.on("broadcast" as any, { event: "message" }, (payload: any) => {
        cbRef.current(payload as T);
      });
    }

    channel.subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [channelName]);
}
