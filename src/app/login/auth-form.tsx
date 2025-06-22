"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // toast import
import { Chrome } from "lucide-react"; // 아이콘 import

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("가입 확인 메일이 발송되었습니다.", {
          description: "메일함(스팸 포함)을 확인해주세요.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.info("로그인 되었습니다. 환영합니다!");
        router.push("/");
        router.refresh(); // 페이지를 새로고침하여 서버 컴포넌트를 다시 렌더링
      }
    } catch (error: any) {
      toast.error(`오류: ${error.message}`);
    }    
  };

  // 구글 로그인 핸들러 (지금은 비어있음)
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{isSignUp ? "회원가입" : "로그인"}</CardTitle>
        <CardDescription>
          {isSignUp ? "이메일로 새 계정을 만드세요." : "계정에 로그인하세요."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleAuthAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">
            {isSignUp ? "가입하기" : "로그인하기"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">OR CONTINUE WITH</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
          <Chrome className="mr-2 h-4 w-4" />
          Google
        </Button>

        {message && <p className="text-sm text-center font-medium text-red-500">{message}</p>}

        <div className="mt-4 text-center text-sm">
          {isSignUp ? "이미 계정이 있으신가요?" : "계정이 없으신가요?"}
          <button onClick={() => setIsSignUp(!isSignUp)} className="underline ml-1">
            {isSignUp ? "로그인" : "회원가입"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}