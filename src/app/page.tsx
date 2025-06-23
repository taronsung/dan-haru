// src/app/page.tsx
export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTodaysQuestion } from "@/lib/questions";
import MainPageUI from "./main-page-ui";

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
    .select("streak, next_question")
    .eq("id", user.id)
    .single();

  const streak = profile?.streak ?? 0;
  const maeumi = getMaeumiCharacter(streak);
  // 개인화 질문이 있으면 그것을 사용하고, 없으면 오늘의 기본 질문을 사용합니다.
  const question = profile?.next_question || getTodaysQuestion();

  // signOut 함수 정의 및 전달 로직 전체 삭제

  return (
    <MainPageUI
      maeumi={maeumi}
      streak={streak}
      question={question}
    />
  );
}