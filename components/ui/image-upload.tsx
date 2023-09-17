"use client"

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";



interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;  // Actualiza el value de la imagen, esta definida en billboard-form.
    onRemove: (value: string) => void;  // Borrar el value de la imagen, también esta definida en billboard-form
    value: string[];                    // Por defecto el value de la imagen es un []
}

const ImageUpload:React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value,    
}) => {
    
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true); // Cuando se monta el provider isMounted=true 
    }, [])

    const onUpload = (result:any) => {          // onUpload obtiene un result y este va a onChange, y este genera un value (url)
        onChange( result.info.secure_url );
    }
    
    if (!isMounted) {        // La condición no se cumple -> el componente se renderizará
        return null;
    } 

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        {/* Boton para borrar la imagen */}
                        <div className="z-10 absolute tops-2 right-2">
                            <Button 
                                type="button" 
                                onClick={() => onRemove(url)} 
                                variant="destructive" 
                                size="icon"
                            >
                                <Trash className="h-4 w-4"/>
                            </Button>
                        </div>
                        {/* Renderizado de la imagen */}
                        <Image 
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>

           
            <CldUploadWidget onUpload={onUpload} uploadPreset="iirbm0ia"> 
                {({ open }) => {    // función que proviene del propio componente CldUploadWidget
                                    // y se utiliza para abrir el diálogo de carga de archivos cuando se hace clic en el botón de carga.

                    const onClick = () => {
                        open();     // Esta línea abre el diálogo de carga
                    }

                    return(
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={onClick}
                        >
                            <ImagePlus className="h-4 w-4 mr-2"/>
                            Upload an Image
                        </Button>    
                    )
                }}
            </CldUploadWidget>
        </div>    
    )
}

export default ImageUpload;