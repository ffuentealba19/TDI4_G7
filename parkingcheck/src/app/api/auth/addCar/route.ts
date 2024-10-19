import { run } from "@/libs/mongodb"; 
import { NextRequest, NextResponse } from "next/server";
import { messages } from "@/utils/messages";
import User from "@/models/users"; 

export async function POST(req: NextRequest) {
  try {
    await run();

    const { UserEmail, Vehiculos } = await req.json();


    if (!UserEmail || !Vehiculos || Vehiculos.length === 0) {
      return NextResponse.json({
        message: messages.error.needProps,
      }, { status: 400 });
    }


    const user = await User.findOne({ UserEmail });

    if (!user) {
      return NextResponse.json({
        message: messages.error.UserNotFound,
      }, { status: 404 });
    }

    user.Vehiculos = Vehiculos;
    await user.save(); 

    return NextResponse.json({
      message: 'Vehículos actualizados correctamente',
      updatedVehiculos: user.Vehiculos,
    }, { status: 200 });

  } catch (error) {
    console.error("Error en la operación:", error);
    return NextResponse.json({
      error: messages.error.UpdateError,
    }, { status: 500 });
  }
}
