"use client"

import { AlertModal } from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useOrigin } from "@/hooks/use-origin"
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

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {

  const[open, setOpen] = useState(false);
  const[loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

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
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success("Store updated")

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
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh();
      router.push("/");
      toast.success("Store deleted.")

    } catch (error) {
      toast.error("Make sure you removed all products and categories first.")
    }finally{
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
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
        { initialData && (
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