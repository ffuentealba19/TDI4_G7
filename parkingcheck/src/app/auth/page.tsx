import Image from "next/image";

export default function Login() {
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-20">
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

