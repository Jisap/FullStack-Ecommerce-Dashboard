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
        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("Billboard Id is required", { status: 400 });
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

        const category = await prismadb.category.create({ // Creamos tablas de datos dentro de prismadb correspondientes a category
            data: {
                name,   // Viene del modal
                billboardId,
                storeId: params.storeId
            }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORIES_POST]', error);
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

        const categories = await prismadb.category.findMany({ // Buscamos tablas de datos dentro de prismadb correspondientes a category
            where: {
                storeId: params.storeId,
            }
        });

        return NextResponse.json(categories);

    } catch (error) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}