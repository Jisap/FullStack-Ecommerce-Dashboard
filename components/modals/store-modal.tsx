"use client"

import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "../ui/modal"

export const StoreModal = () => { // Muestra un Modal en conexión con el store de zustang

    const { isOpen, onClose, onOpen} = useStoreModal();

    return (
        
        <Modal
            title="Create store"
            description="Add a new store to manage products and categories"
            isOpen={isOpen}
            onClose={onClose}
        >
            Future Create Store Form 
        </Modal>
    
    )

}