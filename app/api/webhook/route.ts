import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"
import prismadb from "@/lib/prismadb"

// Los webhooks de Stripe son notificaciones 
// que Stripe envía a tu aplicación cuando ocurren eventos importantes
// en tu cuenta de Stripe, como la finalización de un pago. 

export async function POST(req: Request) { // Los wehooks de stripe usan solicitudes post para enviar eventos a la app
    
    const body = await req.text();                                  // Cuerpo de la solicitud
    const signature = headers().get("Stripe-Signature") as string   // Encabezado usado para verificar la autenticidad del webhook

    let event: Stripe.Event  // Construcción del evento

    try {
        event = stripe.webhooks.constructEvent( // Verficación de la autenticidad del evento
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session; // Si la verificación fue exitosa se obtiene el objeto de session de pago
    const address = session?.customer_details?.address;           // De la session se extrae la dirección del cliente

    const addressComponents = [ // Se forma una cadena legible
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country
    ];

    const addressString = addressComponents.filter((c) => c !== null).join(', ');


    if (event.type === "checkout.session.completed") { // Si el evento es de tipo "checkout.session.completed", 
        const order = await prismadb.order.update({    // se actualiza la orden correspondiente en la base de datos 
            where: {
                id: session?.metadata?.orderId,
            },
            data: {                                             
                isPaid: true,                                   // para marcarla como pagada
                address: addressString,                         // se almacena la dirección 
                phone: session?.customer_details?.phone || '',  // y el número de teléfono del cliente
            },
            include: {
                orderItems: true,
            }
        });

        const productIds = order.orderItems.map((orderItem) => orderItem.productId); //Se obtienen los IDs de los productos relacionados con la orden

        await prismadb.product.updateMany({ // y se marcan como archivados en la base de datos.
            where: {
                id: {
                    in: [...productIds],
                },
            },
            data: {
                isArchived: true
            }
        });
    }

    return new NextResponse(null, { status: 200 });
};