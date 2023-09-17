import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Billboard } from '@prisma/client';


export async function GET(
    req: Request,
    { params }: { params: { billboardId: string } }
) {

    try {

        if (!params.billboardId) {
            return new NextResponse("Billboard Id is required", { status: 400 });
        };

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            },
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_GET', error);
        return new NextResponse("Internal error", { status: 500 });
    }


}


export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string , billboarId: string, } }
) {
    try {

        const { userId } = auth();
        const body = await req.json();
        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        };

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        };

        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
        };

        if (!params.storeId) {
            return new NextResponse("StoreId is required", { status: 400 });
        };

        if(!params.billboarId){
            return new NextResponse("Billboard Id is required", { status: 400 });
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

        const billboard = await prismadb.billboard.update({
            where: {
                id: params.billboarId,
            },
            data: {
                label,
                imageUrl,
            }
        });
        

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('[BILLBOARD_PATCH', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, billboarId: string } }
) {
 
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        };

        if (!params.billboarId) {
            return new NextResponse("Billboard Id is required", { status: 400 });
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

        const billboard = await prismadb.billboard.delete({
            where: {
                id: params.billboarId,
            },
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_DELETE', error);
        return new NextResponse("Internal error", { status: 500 });
    }


}