"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookUser, Users } from "lucide-react";

const navItems = [
  { href: "/feed", icon: Users, label: "모두의 하루" },
  { href: "/", icon: Home, label: "홈" },
  { href: "/my-posts", icon: BookUser, label: "나의 기록" },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === '/login') return null; // 로그인 페이지에선 숨김

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center md:hidden">
      {navItems.map((item) => (
        <Link key={item.label} href={item.href} className={`flex flex-col items-center gap-1 p-2 ${pathname === item.href ? "text-brand-purple" : "text-gray-500"}`}>
          <item.icon size={24} />
          <span className="text-xs">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}