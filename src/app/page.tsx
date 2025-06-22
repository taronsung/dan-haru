// src/app/page.tsx

export const dynamic = 'force-dynamic'; // << 이 라인을 다시 추가했습니다!

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getTodaysQuestion } from "@/lib/questions";
import { submitPost } from "./actions";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import AppContainer from "@/components/common/app-container";
import Image from "next/image";

// '마음이' 캐릭터와 레벨을 결정하는 함수 (이미지 경로 반환)
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md mx-auto">
        
      <AppContainer>
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                <Image src={maeumi.img} alt={`마음이 레벨 ${maeumi.level}`} width={60} height={60} />
            </motion.div>
            <div>
                <p className="font-bold text-lg text-gray-800">마음이 Lv.{maeumi.level}</p>
                <p className="text-sm text-gray-500">연속 {streak}일째 기록중!</p>
            </div>
        </div>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm">로그아웃</Button>
          </form>
        </header>

        <main className="bg-white p-6 rounded-2xl shadow-lg">
          <p className="text-sm text-gray-500 mb-2">오늘의 질문</p>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">{question}</h1>
          
          <form action={submitPost}>
            <Textarea
              name="content"
              placeholder="오늘의 생각을 편하게 남겨보세요..."
              className="min-h-[120px] mb-4"
              required
            />
            <Button type="submit" className="w-full">
              기록 남기기
            </Button>
          </form>
        </main>

      </div>
    </div>
  );
}