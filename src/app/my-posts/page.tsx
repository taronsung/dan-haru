// src/app/my-posts/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function MyPostsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("id, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">나의 기록들</h1>
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString('ko-KR')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>아직 작성한 기록이 없어요.</p>
        )}
      </div>
    </div>
  );
}