"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid admin credentials.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">Secure Admin Access</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Launch Management Login</h1>
        <p className="mt-2 text-sm text-slate-500">Use the admin credentials configured in your environment variables.</p>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <Button className="mt-6 w-full" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </Card>
    </div>
  );
}
