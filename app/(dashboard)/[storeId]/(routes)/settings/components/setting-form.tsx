"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Store } from "@prisma/client"

import { Trash } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface SettingsFormProps {
  initialData: Store
}

const formSchema = z.object({ // Esquema de validación de zod
  name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingForm: React.FC<SettingsFormProps> = ({ initialData }) => {

  const[open, setOpen] = useState(false);
  const[loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({ // Validación de los valores del formulario de react-hook-form según esquema de zod
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async( data: SettingsFormValues ) => {
    console.log(data);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title="Settings"
          description="Manage store preferences"
        />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {}}
        >
          <Trash className="h-4 w-4"/>
        </Button>
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
              name="name"
              render={({field}) => ( // render renderiza el campo del formulario con el arg.field que contiene el value, errores valid y el disabled
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Store name" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />    
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
    </>
  )
}

export default SettingForm