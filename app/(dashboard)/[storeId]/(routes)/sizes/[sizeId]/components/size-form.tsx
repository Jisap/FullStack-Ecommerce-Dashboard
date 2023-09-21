"use client"

import { AlertModal } from "@/components/modals/alert-modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import ImageUpload from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Size } from "@prisma/client"
import axios from "axios"

import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"

interface SizeFormProps {
  initialData: Size | null;
}

const formSchema = z.object({ // Esquema de validación de zod
  name: z.string().min(1),
  value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>; // Se crea un nuevo tipo -> sizeFormValues tendrá la misma estructura que el schema de z

const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => { // Esta función permitirá crear, modificar o borrar un size

  const params = useParams();
  const router = useRouter();
  const[open, setOpen] = useState(false);
  const[loading, setLoading] = useState(false);

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit a size" : "Add a new size";
  const toastMessage = initialData ? "size updated" : "size created";
  const action = initialData ? "Save changes" : "Create";


  const form = useForm<SizeFormValues>({ // Validación de los valores del formulario de react-hook-form según esquema de zod
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    }
  });

  const onSubmit = async( data: SizeFormValues ) => {
    try {
      
      setLoading(true);
      if( initialData ){
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
      }else{
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/sizes`)
      toast.success(toastMessage)

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }finally{
      setLoading(false)
    }
  };

  const onDelete = async () => {
    try {
      
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success("Size deleted.")

    } catch (error) {
      toast.error("Make sure you removed all products using this size first.")
    }finally{
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      {/* Modal que controla el borrado de un size */}
      <AlertModal 
        isOpen={open}
        onClose={() => setOpen(false)} // Cierra el modal con un setOpen(false)
        onConfirm={ onDelete }
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading 
          title={title}
          description={description}
        />
        { initialData && ( // Se renderiza si existe initialData
            <Button
              disabled={loading}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)} // Permite la apertura del modal <AlertModal />
            >
              <Trash className="h-4 w-4"/>
            </Button>
        )}
      </div>

      <Separator />

      {/* Se pasa el estado del formulario validado con zod (form) a <Form> de React-hook-form  */}
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"  
        >
          
          <div className="grid grid-cols-3 gap-8">
            {/* CAmpo para subir el name del size */}
            <FormField 
              control={form.control} // Se pasa el controlador del campo de formulario <Form/> al componente <FormField />
              name="name"
              render={({field}) => ( // render renderiza el campo del formulario con el arg.field que contiene el value, errores valid y el disabled
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Size name" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* CAmpo para subir el name del size */}
            <FormField
              control={form.control} // Se pasa el controlador del campo de formulario <Form/> al componente <FormField />
              name="value"
              render={({ field }) => ( // render renderiza el campo del formulario con el arg.field que contiene el value, errores valid y el disabled
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Size value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />        
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>

    </>
  )
}

export default SizeForm