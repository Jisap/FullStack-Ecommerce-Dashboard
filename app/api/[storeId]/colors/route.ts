import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST(
    req: Request,
    { params }: { params: { storeId: string }}

) {
    
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if(!params.storeId){
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 }); // Se checkea que store pertenezca al userId que lo creo.
        }

        const color = await prismadb.color.create({ // Creamos tablas de datos dentro de prismadb correspondientes a color
            data: {
                name,   // Viene del modal
                value,
                storeId: params.storeId
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLORS_POST]', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }

) {
    try {
      
        if(!params.storeId){
            return new NextResponse("Store id is require", { status: 400 });
        }

        const colors = await prismadb.color.findMany({ // Buscamos tablas de datos dentro de prismadb correspondientes a color
            where: {
                storeId: params.storeId,
            }
        });

        // // Configura los encabezados CORS para permitir solicitudes desde cualquier origen (*)
        // const responseHeaders = {
        //     'Access-Control-Allow-Origin': '*',
        //     'Access-Control-Allow-Methods': 'GET', // Agrega los métodos necesarios
        //     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        // };

        // return new NextResponse(JSON.stringify(colors), {
        //     status: 200,
        //     headers: responseHeaders
        // });

        return NextResponse.json(colors);

    } catch (error) {
        console.log('[COLORS_GET]', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}