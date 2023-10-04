import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    { params }: { params: { categoryId: string } }
) {

    try {

        if (!params.categoryId) {
            return new NextResponse("Category Id is required", { status: 400 });
        };

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            },
            include: {
                billboard: true
            }
        });

        // // Configura los encabezados CORS para permitir solicitudes desde cualquier origen (*)
        // const responseHeaders = {
        //     'Access-Control-Allow-Origin': '*',
        //     'Access-Control-Allow-Methods': 'GET', // Agrega los métodos necesarios
        //     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        // };

        // return new NextResponse(JSON.stringify(category), {
        //     status: 200,
        //     headers: responseHeaders
        // });

        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORY_GET', error);
        return new NextResponse("Internal error", { status: 500 });
    }


}


export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string , categoryId: string, } }
) {
    try {

        const { userId } = auth();
        const body = await req.json();
        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        };

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        };

        if (!billboardId) {
            return new NextResponse("Billboard Id is required", { status: 400 });
        };

        if (!params.storeId) {
            return new NextResponse("StoreId is required", { status: 400 });
        };

        if(!params.categoryId){
            return new NextResponse("Category Id is required", { status: 400 });
        }

        
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserId){
            return new NextResponse("Unauthorized", { status: 405 });
        }

        const category = await prismadb.category.update({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId,
            }
        });
        

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_PATCH', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
 
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        };

        if (!params.categoryId) {
            return new NextResponse("Category Id is required", { status: 400 });
        };

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const category = await prismadb.category.delete({
            where: {
                id: params.categoryId,
            },
        });

        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORY_DELETE', error);
        return new NextResponse("Internal error", { status: 500 });
    }


}