// tailwind.config.ts
// ... 상단 코드는 그대로
/** @type {import('tailwindcss').Config} */
module.exports = {
    // ... darkMode, content 등은 그대로
    theme: {
      container: {
        // ...
      },
      extend: {
        colors: {
          // 여기에 '몽글몽글' 팔레트 추가
          'brand-pink': '#FFCDEA',
          'brand-yellow': '#FFF3A3',
          'brand-purple': '#a78bfa', // 좀 더 진한 보라색으로 변경
          'bg-soft': '#f7f9fc',
          // ... shadcn/ui 기본 컬러들은 그대로 둡니다.
        },
        // ... keyframes, animation 등은 그대로
      },
    },
    plugins: [require("tailwindcss-animate")],
  }