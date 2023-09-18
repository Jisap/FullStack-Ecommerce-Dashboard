"use client"

import { Copy, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Badge, BadgeProps } from "./badge";
import { Button } from "./button";
import toast from "react-hot-toast";


interface ApiAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin";
};

// Tipo para el texto debajo de las badge
const textMap: Record<ApiAlertProps["variant"], string> = { // Mapeo que asocia cada posible valor de ApiAlertProps-variant con una cadena de texto.
    public: "Public",                                       // Cuando variant es public el valor asociado será "Public".
    admin: "Admin"                                          // Cuando variant es admin el valor asociado será "Admin".
}

// Tipo para las badges
const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = { // Lo mismo pero las cadenas de texto provienen de las BadgeProps: default, seconday, destructive y outline
    public: "secondary",                                       
    admin: "destructive"                                          
}

export const ApiAlert: React.FC<ApiAlertProps> = ({
    title,
    description,
    variant = "public",
}) => {

  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("API Route copied to the clipboard");
  }

  return (
    <Alert>
        {/* Esta primera parte controla el estilo y el texto que se muestra */}
        <Server className="h-4 w-4"/>
        <AlertTitle className="flex items-center gap-x-2">
            {title}
            {/* Aplica el estilo secondary de Badge */}
            <Badge variant={variantMap[variant]}>
                {/* Al ser variant=public se establece como texto del badge "Public" */}
                {textMap[variant]}
            </Badge> 
        </AlertTitle>

        {/* Esta segunda parte muestra la url y el boton para copiarla */}
        <AlertDescription className="mt-4 flex items-center justify-between">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {description}
            </code>
            <Button 
                variant="outline"
                size="icon"
                onClick={onCopy}
            >
                <Copy className="h-4 w-4"/>
            </Button>
        </AlertDescription>
    </Alert>  
    
  )
}