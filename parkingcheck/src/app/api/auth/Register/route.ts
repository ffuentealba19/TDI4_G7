import { run } from "@/libs/mongodb"; 
import { NextRequest, NextResponse } from "next/server";
import { messages } from "@/utils/messages";
import { isValidEmail } from "@/utils/isValidEmail";
import User from "@/models/users"; 
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await run();

    const { UserName, UserEmail, UserPass, ConfirmPass } = await req.json();

    if (!UserName || !UserEmail || !UserPass || !ConfirmPass) {
      return NextResponse.json({
        message: messages.error.needProps,
      }, { status: 400 });
    }

    if (!isValidEmail(UserEmail)) {
      return NextResponse.json({
        message: messages.error.InvalidEmail,
      }, { status: 400 });
    }

    if (UserPass !== ConfirmPass) {
      return NextResponse.json({
        message: messages.error.PassNotMatch,
      }, { status: 400 });
    }

    const UserFind = await User.findOne({ UserEmail });
    if (UserFind) {
      return NextResponse.json({
        message: messages.error.EmailExits,
      }, { status: 400 });
    }

    const HashedPass = await bcrypt.hash(UserPass, 10);

    const newUser = new User({
      UserName,
      UserEmail,
      UserPass: HashedPass,
      url: "https://res.cloudinary.com/dhlfth3i0/image/upload/v1727491033/i6sxdq4xgfkti4hnidot.jpg",
      vip: false,
    });
    await newUser.save(); 

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurado en las variables de entorno');
    }

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.UserEmail },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return NextResponse.json({
      message: 'Registro exitoso',
      token,
      redirectUrl: '/',
    }, { status: 200 });

  } catch (error) {
    console.error("Error en la operación:", error);
    return NextResponse.json({
      error: messages.error.RegisterError,
    }, { status: 500 });
  }
}
