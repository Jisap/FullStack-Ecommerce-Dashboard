import { create } from "zustand";

interface useStoreModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useStoreModal = create<useStoreModalStore>((set) => ({ // Estado para el modal
    isOpen: false,                                                  // Valor por defecto de isOpen  
    onOpen: () => set({ isOpen: true }),                            // onOpen pone en true isOpen
    onClose: () => set({ isOpen: false })                           // OnClose pone en false isOpen
}))