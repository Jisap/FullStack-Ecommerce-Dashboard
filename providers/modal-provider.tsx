"use client"

import { useEffect, useState } from "react";
import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = () => { // Provee a la app el estado del modal

    const [isMounted, setIsMounted] = useState( false );

    useEffect(() => {
       setIsMounted(true); // Cuando se monta el provider isMounted=true 
    },[])

    if(!isMounted){        // La condición no se cumple -> el componente se renderizará
        return null;
    }                      // Esto evita que el componente se renderice innecesariamente cuando ya se ha creado -> evita problemas de rehidratación

    return(
        <>
            <StoreModal />
        </>    
    );
};