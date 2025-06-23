"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AppContainer from "@/components/common/app-container";
import { submitPost, signOut } from "./actions";
import { FormEvent } from "react";
import { toast } from "sonner";

type MainPageUIProps = {
  maeumi: { level: number; img: string };
  streak: number;
  question: string;
};

export default function MainPageUI({ maeumi, streak, question }: MainPageUIProps) {

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const content = formData.get("content") as string;

    // 버튼을 잠시 비활성화
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) submitButton.disabled = true;

    toast.promise(submitPost(formData), {
      loading: '기록을 저장하고 있어요...',
      success: () => {
        if (content) {
          fetch('/api/generate-question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
          });
        }
        // 폼 리셋
        form.reset();
        if (submitButton) submitButton.disabled = false;
        return '오늘의 기록이 저장됐어요!';
      },
      error: (err) => {
        if (submitButton) submitButton.disabled = false;
        return `저장에 실패했어요: ${err.message}`;
      },
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="absolute top-4 right-4 z-10">
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">로그아웃</Button>
        </form>
      </header>

      <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <p className="text-gray-500 mb-2">오늘의 질문</p>
          <h1 className="text-3xl font-bold text-gray-800 break-keep">{question}</h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <form onSubmit={handleFormSubmit} className="relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
              <Image src={maeumi.img} alt={`마음이 레벨 ${maeumi.level}`} width={72} height={72} />
              <div className="bg-brand-purple text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                {streak}일째
              </div>
            </div>
            <input type="hidden" name="question" value={question} />
            <Textarea
              name="content"
              placeholder="어떤 일이 있었나요?"
              className="w-full min-h-[160px] pt-20 p-5 text-base rounded-2xl shadow-xl border-gray-200 focus-visible:ring-brand-purple resize-none"
              required
            />
            <div className="mt-4">
                <Button type="submit" className="w-full h-12 text-base rounded-xl bg-brand-purple hover:bg-brand-purple/90 shadow-lg shadow-brand-purple/30 transition-transform active:scale-95">
                    기록 남기기
                </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}