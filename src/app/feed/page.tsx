// src/app/feed/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const today = new Date().toISOString().slice(0, 10);
  const { data: posts } = await supabase
    .from("posts")
    .select("id, content")
    .neq("user_id", user.id) // 내 글은 제외
    .gte("created_at", `${today}T00:00:00.000Z`)
    .lte("created_at", `${today}T23:59:59.999Z`);

  // 서버에서 포스트를 섞어줍니다 (간단한 방식)
  const shuffledPosts = posts?.sort(() => Math.random() - 0.5) || [];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">모두의 하루</h1>
      <p className="text-sm text-gray-600 mb-4">오늘 다른 사람들은 어떤 생각을 했을까요?</p>
      <div className="space-y-4">
        {shuffledPosts.length > 0 ? (
          shuffledPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <p>{post.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>오늘은 아직 다른 사람들의 기록이 없네요.</p>
        )}
      </div>
    </div>
  );
}