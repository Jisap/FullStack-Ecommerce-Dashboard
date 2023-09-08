import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import Navbar from "../../../components/navbar";


export default async function DashboardLayout({
    children,
    params, 
}:{
    children: React.ReactNode
    params: { storeId: string}
}){
    const { userId } = auth();
    if(!userId){
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({ // Buscamos el primer store
        where: {
            id: params.storeId,                    // donde el id sea el de los params
            userId                                 // y el userId el user logueado 
        }
    });

    if(!store){
        redirect('/');
    }

    return(
        <>
            <Navbar />
            { children }
        </>    
    )
} 
    

