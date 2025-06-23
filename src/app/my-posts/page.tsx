// src/app/my-posts/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import AppContainer from "@/components/common/app-container";

export const dynamic = 'force-dynamic';

export default async function MyPostsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("id, content, created_at, question")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <AppContainer>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">기억의 병</h1>
        <p className="text-gray-500">당신이 남긴 {posts?.length || 0}개의 소중한 기억 조각들</p>
      </div>

      <div className="relative w-full max-w-xs mx-auto min-h-[450px] bg-blue-100/30 rounded-t-[80px] rounded-b-2xl border-2 border-white/80 shadow-inner p-5 pt-8">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[55%] h-5 bg-yellow-200/60 border-2 border-yellow-300/70 rounded-full shadow-md" />
        
        <div className="flex flex-wrap gap-3 justify-center content-start">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Dialog key={post.id}>
                <DialogTrigger asChild>
                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-purple/70 hover:bg-brand-purple hover:scale-110 transition-transform shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple">
                    <div className="w-3 h-3 bg-white/70 rounded-full" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-2xl font-sans">
                  <DialogHeader>
                    <DialogTitle className="text-gray-500 font-normal text-sm">{new Date(post.created_at).toLocaleDateString('ko-KR')}</DialogTitle>
                    <DialogDescription className="text-xl text-gray-800 pt-2 !mt-1">
                      {post.question || "기록"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 border-t mt-4">
                    <p className="leading-relaxed text-base">{post.content}</p>
                  </div>
                </DialogContent>
              </Dialog>
            ))
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400">아직 기억 조각이 없어요.</p>
            </div>
          )}
        </div>
      </div>
    </AppContainer>
  );
}