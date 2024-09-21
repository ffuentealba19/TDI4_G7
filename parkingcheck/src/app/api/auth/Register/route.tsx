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
    });

    await newUser.save(); 
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.UserEmail },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '8h' }
    );

    return NextResponse.json({
      message: 'Registro exitoso',
      token,
    }, { status: 200 });

  } catch (error) {
    console.error("Error en la operación:", error);
    return NextResponse.json({
      error: messages.error.RegisterError,
    }, { status: 500 });
  }
}
