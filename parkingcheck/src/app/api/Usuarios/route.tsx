import connectMongoDB from "@/libs/mongodb"
import {NextResponse} from "next/server"
import usuarios from "@/models/users";
    
export async function POST(request : any) {

    const data = await request.json();
    try {
        await connectMongoDB();
        console.log("si se pudo1")
        const newuser = new usuarios(data);
        console.log("si se pudo2")
        await newuser.save();
        console.log("si se pudo3")
        return NextResponse.json({message : "nuevo usuario creado"});
    } 
    catch (error) {
        console.error("Error al crear el usuario:", error);
        return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 });
    }
}

