"use client"

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios  from "axios";

import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "../ui/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";


const formSchema = z.object({                           // Esquema de validación zod
    name: z.string().min(1),
});

export const StoreModal = () => {                       // Muestra un Modal en conexión con el store de zustang

    const { isOpen, onClose, onOpen} = useStoreModal();

    const[loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({  // Validación de los valores del formulario de react-hook-form según esquema de zod
        resolver: zodResolver(formSchema),                           
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => { // onSubmit recibe los valores del formulario validados
        
        try {
            setLoading(true)
            const response = await axios.post('/api/stores', values); // Los valores se envían a la api para crear una bd con el nombre dado en el modal
            toast.success("Store created.");
        } catch (error) {
            toast.error("Something went wrong.");
        }finally{
            setLoading(false)
        }
    }

    return (
        
        <Modal
            title="Create store"
            description="Add a new store to manage products and categories"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={loading}
                                                placeholder="e-commerce" 
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button 
                                    disabled={loading}
                                    variant="outline"
                                    onClick={onClose}    // Establece isOpen=false
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={loading}
                                    type="submit"
                                >
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    
    )

}