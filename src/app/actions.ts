// src/app/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export async function submitPost(formData: FormData) {
  const supabase = createClient();
  const content = formData.get("content") as string;

  if (!content) {
    return { error: "내용을 입력해주세요." };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // 오늘 이미 글을 썼는지 확인
  const today = new Date().toISOString().slice(0, 10);
  const { data: existingPost, error: _selectError } = await supabase
    .from("posts")
    .select("id")
    .eq("user_id", user.id)
    .gte("created_at", `${today}T00:00:00.000Z`)
    .lte("created_at", `${today}T23:59:59.999Z`)
    .single();

  if (existingPost) {
     console.log("오늘 이미 글을 작성했습니다.");
     return redirect("/");
  }

  // 새 포스트 삽입
  const { error: insertError } = await supabase
    .from("posts")
    .insert({ user_id: user.id, content });

  if (insertError) {
     console.error("Insert Error:", insertError);
     return { error: "글을 저장하는 데 실패했습니다." };
  }

  const { data: profile } = await supabase.from("profiles").select("streak, last_posted_at").eq("id", user.id).single();
  if (!profile) throw new Error("프로필을 찾을 수 없습니다.");

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastPostedDate = profile.last_posted_at ? new Date(profile.last_posted_at) : null;
  let newStreak = profile.streak;

  if (!lastPostedDate || lastPostedDate.toDateString() === yesterday.toDateString()) {
      newStreak++;
  } else if (lastPostedDate.toDateString() !== today.toDateString()) {
      newStreak = 1; // 어제가 아니면 스트릭 리셋
  }

  const { error: updateError } = await supabase
      .from("profiles")
      .update({ streak: newStreak, last_posted_at: today.toISOString() })
      .eq("id", user.id);

  if (updateError) throw new Error("스트릭 정보 업데이트에 실패했습니다.");

  revalidatePath("/");
  revalidatePath("/my-posts");
  toast.success("오늘의 기록이 저장됐어요!");
}