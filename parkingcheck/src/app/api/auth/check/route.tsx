import { messages } from "@/utils/messages";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
    try {
        const headersList = headers();
        const token = headersList.get("token");

        if (!token) {
            return NextResponse.json(
                {
                    message: messages.error.NotAuthorised,
                },
                {
                    status: 401, 
                }
            );
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto");
            
            return NextResponse.json(
                {
                    message: "Token válido",
                    userData: decoded, 
                },
                {
                    status: 200,
                }
            );
        } catch (error) {
            return NextResponse.json(
                {
                    message: messages.error.InvalidToken,
                },
                {
                    status: 403, 
                }
            );
        }
    } catch (error) {
        console.error("Error en la operación:", error);
        return NextResponse.json(
            {
                error: messages.error.InternalServerError,
            },
            {
                status: 500,
            }
        );
    }
}
