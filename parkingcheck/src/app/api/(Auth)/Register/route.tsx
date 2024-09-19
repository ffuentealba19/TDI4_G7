import { run } from "@/libs/mongodb"; 
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {

    const client = await run();


    // Parse the incoming JSON data
    const { UserName, UserEmail, UserPass } = await req.json();

    // Validate required fields
    if (!UserName || !UserEmail || !UserPass) {
      return NextResponse.json({ error: 'Campos faltantes' }, { status: 400 });
    }

    // Insert into 'usuarios' collection
    const collection = client.db("ParkingCheckIntegra").collection("usuarios");
    const result = await collection.insertOne({
      UserName,
      UserEmail,
      UserPass,
    });

    return NextResponse.json({ message: 'Registro exitoso', result }, { status: 200 });
  } catch (error) {
    console.error("Error en la operación", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}