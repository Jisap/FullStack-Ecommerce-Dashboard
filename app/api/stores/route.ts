import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST(
    req:Request,
    
) {
    try {
        const { userId } = auth();
        const  body = await req.json();
        const { name } = body;

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!name){
            return new NextResponse("Name is required", { status: 400 });
        }

        const store = await prismadb.store.create({ // Creamos tablas de datos dentro de prismadb
            data: {
                name,   // Viene del modal
                userId, // Viene del usuario logueado
            }
        });

        return NextResponse.json(store); // Creamos una bd con el name del store en bd y el usuario logueado que la creo

    } catch (error) {
        console.log('[STORES_POST]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}