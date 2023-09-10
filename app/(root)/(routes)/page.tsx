"use client"

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

const SetupPage = () => {

    const onOpen = useStoreModal((state) => state.onOpen); // Función para poner en true isOpen
    const isOpen = useStoreModal((state) => state.isOpen); // Estado de isOpen

    useEffect(() => { // Abre el modal al cambiar isOpen=true -> ModalProvider -> StoreModal abre el modal de creación de stores
        if(!isOpen){
            onOpen();
        }
    },[isOpen, onOpen]);

    return (

        null
        // <div className="p-4">
        //     {/* <UserButton afterSignOutUrl="/"/> */}
        //     Root Page
        // </div>
    )
}

export default SetupPage;
