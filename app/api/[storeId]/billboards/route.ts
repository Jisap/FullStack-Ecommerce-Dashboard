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
        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("Image Url is required", { status: 400 });
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

        const billboard = await prismadb.billboard.create({ // Creamos tablas de datos dentro de prismadb correspondientes a billboard
            data: {
                label,   // Viene del modal
                imageUrl,
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARDS_POST]', error);
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

        const billboards = await prismadb.billboard.findMany({ // Buscamos tablas de datos dentro de prismadb correspondientes a billboard
            where: {
                storeId: params.storeId,
            }
        });

        return NextResponse.json(billboards);

    } catch (error) {
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}