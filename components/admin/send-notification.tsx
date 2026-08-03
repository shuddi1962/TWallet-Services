"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sendUserNotification, getUsers } from "@/lib/admin/actions";
import { toast } from "sonner";

const NOTICE_TYPES = [
  { value: "notice", label: "Notice (General announcement)" },
  { value: "promotion", label: "Promotion" },
  { value: "system", label: "System Alert" },
  { value: "shipping_update", label: "Shipping Update" },
  { value: "support_reply", label: "Support Reply" },
];

export function SendNotification() {
  const [audience, setAudience] = useState<"all" | "user">("all");
  const [type, setType] = useState("notice");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState<{ id: string; label: string }[]>([]);
  const [sending, setSending] = useState(false);

  const loadUsers = async () => {
    if (users.length > 0) return;
    const { users: list } = await getUsers({ pageSize: 300 });
    setUsers(
      (list ?? []).map((u) => ({
        id: u.id,
        label: `${u.full_name}${u.email ? ` (${u.email})` : ""}`,
      })),
    );
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (audience === "user" && !userId) {
      toast.error("Choose a recipient");
      return;
    }
    setSending(true);
    try {
      const result = await sendUserNotification({
        audience,
        userId: audience === "user" ? userId : undefined,
        type,
        title,
        message,
      });
      if (result.success) {
        toast.success(
          audience === "all"
            ? `Notice sent to ${result.recipients} users`
            : "Notice sent to the user",
        );
        setTitle("");
        setMessage("");
      } else {
        toast.error(result.error);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Notice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSend} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="notice-audience" className="mb-1 block text-xs font-medium text-slate-500">
                Audience
              </label>
              <select
                id="notice-audience"
                value={audience}
                onFocus={() => audience === "user" && void loadUsers()}
                onChange={(e) => {
                  setAudience(e.target.value as "all" | "user");
                  if (e.target.value === "user") void loadUsers();
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              >
                <option value="all">All users (general notice)</option>
                <option value="user">Individual user</option>
              </select>
            </div>
            <div>
              <label htmlFor="notice-type" className="mb-1 block text-xs font-medium text-slate-500">
                Type
              </label>
              <select
                id="notice-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              >
                {NOTICE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {audience === "user" && (
            <div>
              <label htmlFor="notice-user" className="mb-1 block text-xs font-medium text-slate-500">
                Recipient
              </label>
              <select
                id="notice-user"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onFocus={() => void loadUsers()}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              >
                <option value="">Select a user…</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="notice-title" className="mb-1 block text-xs font-medium text-slate-500">
              Title
            </label>
            <input
              id="notice-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Maintenance scheduled tonight at 11:00 PM"
              maxLength={120}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label htmlFor="notice-message" className="mb-1 block text-xs font-medium text-slate-500">
              Message
            </label>
            <textarea
              id="notice-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Optional longer message shown on the user's Notifications page…"
              rows={3}
              maxLength={1000}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <Button type="submit" disabled={sending} className="gap-2">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
            {sending ? "Sending…" : audience === "all" ? "Send to all users" : "Send to user"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}