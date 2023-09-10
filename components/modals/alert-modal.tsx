"use client"

import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    },[]);

    if(!isMounted){
        return null;
    };

    return (
        <Modal
            title="Are you sure"
            description="This action cannot ne undone"
            isOpen={isOpen}   // Controla la apertura del <Modal />
            onClose={onClose} // Controla el cierre del <Modal />  
        >
            <div className='pt-6 space-x-2 flex items-center justify-end'>
                <Button
                    disabled={loading}
                    variant="outline"
                    onClick={() => onClose }
                >
                    Cancel
                </Button>
                <Button
                    disabled={loading}
                    variant="destructive"
                    onClick={ onConfirm }
                >
                    Continue
                </Button>
            </div>
        </Modal>   
    )

}