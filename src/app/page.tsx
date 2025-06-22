// src/app/page.tsx
export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTodaysQuestion } from "@/lib/questions";
import MainPageUI from "./main-page-ui"; // 방금 만든 UI 컴포넌트 import

const getMaeumiCharacter = (streak: number) => {
  if (streak >= 15) return { level: 4, img: "/maeumi-lv4.png" };
  if (streak >= 8) return { level: 3, img: "/maeumi-lv3.png" };
  if (streak >= 4) return { level: 2, img: "/maeumi-lv2.png" };
  return { level: 1, img: "/maeumi-lv1.png" };
};

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("streak")
    .eq("id", user.id)
    .single();

  const streak = profile?.streak ?? 0;
  const maeumi = getMaeumiCharacter(streak);
  const question = getTodaysQuestion();

  const signOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  // 서버에서 가져온 모든 데이터를 클라이언트 컴포넌트로 전달
  return (
    <MainPageUI
      maeumi={maeumi}
      streak={streak}
      question={question}
      signOut={signOut}
    />
  );
}