// src/app/main-page-ui.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AppContainer from "@/components/common/app-container";
import { submitPost, signOut } from "./actions"; // signOut을 actions에서 직접 import

type MainPageUIProps = {
  maeumi: { level: number; img: string };
  streak: number;
  question: string;
  // signOut prop은 이제 필요 없습니다.
};

export default function MainPageUI({ maeumi, streak, question }: MainPageUIProps) {
  return (
    <AppContainer>
      <header className="flex justify-between items-center mb-6">
        {/* ... 마음이 보여주는 부분 ... */}
        <div className="flex items-center gap-3">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
            <Image src={maeumi.img} alt={`마음이 레벨 ${maeumi.level}`} width={60} height={60} />
          </motion.div>
          <div>
            <p className="font-bold text-lg text-gray-800">마음이 Lv.{maeumi.level}</p>
            <p className="text-sm text-gray-500">연속 {streak}일째 기록중!</p>
          </div>
        </div>

        {/* form의 action에 actions.ts에서 가져온 signOut을 직접 연결 */}
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm">로그아웃</Button>
        </form>
      </header>
      
      {/* ... main 부분은 그대로 ... */}
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
          <Button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/90">
            기록 남기기
          </Button>
        </form>
      </main>
    </AppContainer>
  );
}