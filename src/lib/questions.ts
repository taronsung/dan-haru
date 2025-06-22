// src/lib/questions.ts
export const questions = [
    "오늘 가장 감사했던 일은 무엇인가요?",
    "오늘 나를 가장 웃게 만든 순간은 언제였나요?",
    "새롭게 배우거나 깨달은 점이 있나요?",
    "오늘 가장 나를 편안하게 해준 것은 무엇인가요?",
    "내일의 나에게 해주고 싶은 칭찬 한마디는?",
    "오늘 성취한 작은 성공이 있다면 무엇인가요?",
    "요즘 가장 몰두하고 있는 생각은 무엇인가요?",
    "오늘 느꼈던 감정 중 하나를 꼽자면?",
    "누군가에게 친절을 베풀었던 순간이 있나요?",
    "하늘을 올려다볼 시간이 있었나요? 어땠나요?",
  ];
  
  export const getTodaysQuestion = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return questions[dayOfYear % questions.length];
  };