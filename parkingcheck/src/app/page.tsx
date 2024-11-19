"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../styles/style1.css'; 
import { Navbar } from '@/Components/Navbar'; 

export default function MainPage() {
    const router = useRouter();

    const handleSelection = (role: string) => {
        if (role === 'user') {
            router.push('/loginUsers'); 
        } else if (role === 'operator') {
            router.push('/loginOperators'); 
        }
    };

    return (
        <div>
            <Navbar /> {}
            <main className="main">
                <div className="logo-container">
                    <Image
                        src="/Logo_UCT.webp"
                        alt="Logo UCT"
                        width={700}
                        height={700}
                        className="logo-image"
                        style={{ opacity: 0.5 }}
                    />
                </div>
                <div className="container">
                    <h2 className="title">Bienvenido seleccione su rol</h2>
                    <div className="button-group">
                        <button onClick={() => handleSelection('user')} className="toggle-button">
                            Soy Usuario
                        </button>
                        <button onClick={() => handleSelection('operator')} className="toggle-button">
                            Soy Operario
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
