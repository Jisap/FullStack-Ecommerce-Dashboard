"use client"

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "../ui/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


const formSchema = z.object({                           // Esquema de validación zod
    name: z.string().min(1),
});

export const StoreModal = () => {                       // Muestra un Modal en conexión con el store de zustang

    const { isOpen, onClose, onOpen} = useStoreModal();

    const form = useForm<z.infer<typeof formSchema>>({  // Validación de los valores del formulario de react-hook-form según esquema de zod
        resolver: zodResolver(formSchema),                           
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        // TODO: Create Store
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
                                    variant="outline"
                                    onClick={onClose}    // Establece isOpen=false
                                >
                                    Cancel
                                </Button>
                                <Button
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