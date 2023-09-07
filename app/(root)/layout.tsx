import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export default async function SetupLaYout({ children }: {children: React.ReactNode}) {
    
    const { userId } = auth();
    if(!userId){
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({  // Busca el primer store que haya creado el usuario logueado
        where: {
            userId: userId
        }
    });

    if(store){
        redirect(`/${store.id}`);   // Redirección a [storeId]
    }

    return (
        <>
            { children }    
        </>
    )
}