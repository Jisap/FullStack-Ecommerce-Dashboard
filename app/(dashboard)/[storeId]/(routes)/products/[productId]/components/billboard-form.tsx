"use client"

import { AlertModal } from "@/components/modals/alert-modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import ImageUpload from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Image, Product } from "@prisma/client"
import axios from "axios"

import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"

interface ProductFormProps {
  initialData: Product & {
    images: Image[]
  } | null;
}

const formSchema = z.object({ // Esquema de validación de zod
  name: z.string().min(1),
  images: z.object({ url: z.string()}).array(),
  price: z.coerce.number().min(1), // tiene que ser número
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>; // Se crea un nuevo tipo -> BillboardFormValues tendrá la misma estructura que el schema de z

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => { // Esta función permitirá crear, modificar o borrar un billboard

  const params = useParams();
  const router = useRouter();
  const[open, setOpen] = useState(false);
  const[loading, setLoading] = useState(false);

  const title = initialData ? "Edit product" : "Create Product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData ? "Product updated" : "Product created";
  const action = initialData ? "Save changes" : "Create";


  const form = useForm<ProductFormValues>({ // Validación de los valores del formulario de react-hook-form según esquema de zod
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(String(initialData?.price)) // Como en eschema esta definido como decimal -> convertirmos a float number
    } : {
      name: '',
      images: [],
      price: 0,
      categoryId: '',
      colorId: '',
      sizeId: '',
      isFeatured: false,
      isArchived: false
    }
  });

  const onSubmit = async( data: ProductFormValues ) => {
    try {
      
      setLoading(true);
      if( initialData ){
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
      }else{
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`)
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted.")

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
            name="images"
            render={({ field }) => ( // render renderiza el campo del formulario con el arg.field que contiene el value, errores valid y el disabled
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value.map((image) => image.url)} 
                    disabled={loading}
                    onChange={(url) => field.onChange([...field.value, { url }])}  // Es una función que añade un value (url) al campo field. onchange viene de react-hook-forms
                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}  // Función que resetea el valor de la url
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />    
          <div className="grid grid-cols-3 gap-8">
            {/* CAmpo para subir el name del product */}
            <FormField 
              control={form.control} // Se pasa el controlador del campo de formulario <Form/> al componente <FormField />
              name="name"
              render={({field}) => ( // render renderiza el campo del formulario con el arg.field que contiene el value, errores valid y el disabled
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Product name" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} // Se pasa el controlador del campo de formulario <Form/> al componente <FormField />
              name="price"
              render={({ field }) => ( // render renderiza el campo del formulario con el arg.field que contiene el value, errores valid y el disabled
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="9.99" {...field} />
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

export default ProductForm