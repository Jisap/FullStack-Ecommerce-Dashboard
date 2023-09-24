import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST(
    req: Request,
    { params }: { params: { storeId: string }}

) {
    
    try {
        const { userId } = auth();
        const body = await req.json();                            // por defecto false  
        const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if(!images || !images.length ){
            return new NextResponse("Images are required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Category Id is required", { status: 400 });
        }

        if (!sizeId) {
            return new NextResponse("Size is is required", { status: 400 });
        }

        if (!colorId) {
            return new NextResponse("Color Id is required", { status: 400 });
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

        const product = await prismadb.product.create({ // Creamos tablas de datos dentro de prismadb correspondientes a product
            data: {
                name,   // Viene del modal
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                storeId: params.storeId,
                images:{
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }

) {
    try {

        const { searchParams } = new URL(req.url);                          // Se crea un objeto url desde la req
        const categoryId = searchParams.get("categoryId") || undefined ;    // Se obtiene los params de esa url
        const colorId = searchParams.get("colorId" ) || undefined; 
        const sizeId = searchParams.get("sizeId") || undefined; 
        const isFeatured = searchParams.get("isFeatured"); 

        if(!params.storeId){
            return new NextResponse("Store id is require", { status: 400 });
        }

        const products = await prismadb.product.findMany({ // Buscamos tablas de datos dentro de prismadb correspondientes a product
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {  // Relaciones
                images: true,
                category: true,
                color: true,
                size: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return NextResponse.json(products);

    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}