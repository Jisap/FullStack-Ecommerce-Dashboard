"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog'


interface ModalProps {
    title       : string;
    description : string;
    isOpen      : boolean;
    onClose     : () => void;
    children?   : React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ // Componente que define un modal 
    title,
    description,
    isOpen,
    onClose,
    children
}) => {

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen}               // open recibe un booleano y determina si esta o no abierto el modal según shadcn
                onOpenChange={onChange}     // si open es false cierra el dialog
        >    
            <DialogContent>
                
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                
                <div>
                    {children}
                </div>
                
            </DialogContent>
        </Dialog>      
    )
}