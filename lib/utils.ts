import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) { // La función cn() es un helper de Shadcn UI que se usa para combinar  
  return twMerge(clsx(inputs))                // clases Tailwind CSS de forma condicional.
}
