"use client"

import { AlertModal } from "@/components/modals/alert-modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import ImageUpload from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Billboard } from "@prisma/client"
import axios from "axios"

import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"

interface BillboardFormProps {
  initialData: Billboard | null;
}

const formSchema = z.object({ // Esquema de validación de zod
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>; // Se crea un nuevo tipo -> BillboardFormValues tendrá la misma estructura que el schema de z

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => { // Esta función permitirá crear, modificar o borrar un billboard

  const[open, setOpen] = useState(false);
  const[loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();;

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = initialData ? "Billboard updated" : "Billboard created";
  const action = initialData ? "Save changes" : "Create";


  const form = useForm<BillboardFormValues>({ // Validación de los valores del formulario de react-hook-form según esquema de zod
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
    }
  });

  const onSubmit = async( data: BillboardFormValues ) => {
    try {
      
      setLoading(true);
      if( initialData){
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
      }else{
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`)
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
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
      router.refresh();
      router.push("/");
      toast.success("Billboard deleted.")

    } catch (error) {
      toast.error("Make sure you removed all categories using this billboard first.")
    }finally{
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      {/* Modal que controla el borrado de un billboard */}
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
          {/* Campo para subir la imagen */}
          <FormField
            control={form.control} // Se pasa el controlador del campo de formulario <Form/> al componente <FormField />
            name="imageUrl"
            render={({ field }) => ( // render renderiza el campo del formulario con el arg.field que contiene el value, errores valid y el disabled
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value ? [field.value] : []} 
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}  // Es una función que añade un value (url) al campo field. onchange viene de react-hook-forms
                    onRemove={() => field.onChange("")}      // Función que resetea el valor de la url
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />    
          <div className="grid grid-cols-3 gap-8">
            {/* CAmpo para subir el label del billboard */}
            <FormField 
              control={form.control} // Se pasa el controlador del campo de formulario <Form/> al componente <FormField />
              name="label"
              render={({field}) => ( // render renderiza el campo del formulario con el arg.field que contiene el value, errores valid y el disabled
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Billboard label" {...field}/>
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

      <Separator />

    </>
  )
}

export default BillboardForm