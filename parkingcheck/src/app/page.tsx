import Image from "next/image";
import "./globals.css";

export default function Home() {
  return (
    <div>
<header className="bg-sky-500 text-white dark:bg-sky-550 lg:text-left">
  <div className="flex items-center justify-between border-b-2 border-sky-200 p-2 dark:border-sky-400">
    <div className="flex items-center space-x-4 text-3xl font-extrabold">
      <img src="/Logo_UCT.webp" alt="Avatar" className="w-20 rounded-full" />
      <p>PARKING CHECK</p>
    </div>
  </div>
</header>
      <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <div>
        <Image 
          src="/Logo_UCT.webp"
          alt="Logo UCT"
          width={500}
          height={300}
          style={{opacity:0.5}}
        />
      </div>
    </main>
    </div>
  );
}


