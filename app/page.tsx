import Game2048 from '@/components/Game2048';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf8ef] flex flex-col items-center justify-center p-4">
      <Game2048 />
    </main>
  );
}