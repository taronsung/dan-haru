// src/app/feed/feed-ui.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import AppContainer from "@/components/common/app-container";

type Post = {
  id: number;
  content: string;
}

type FeedUIProps = {
  posts: Post[];
}

export default function FeedUI({ posts }: FeedUIProps) {
  return (
    <AppContainer>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">모두의 하루</h1>
        <p className="text-gray-500">오늘 다른 사람들은 어떤 생각을 했을까요?</p>
      </div>
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="shadow-md border-gray-100">
                <CardContent className="pt-6">
                  <p className="leading-relaxed">{post.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400">오늘은 아직 다른 사람들의 기록이 없네요.</p>
          </div>
        )}
      </div>
    </AppContainer>
  );
}