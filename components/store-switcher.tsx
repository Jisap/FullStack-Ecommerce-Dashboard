"use client"

import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { useState } from "react";
import { Store } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";


type PopoverTriggerProps = React.ComponentPropsWithRef<typeof PopoverTrigger>

interface StoreSWitcherProps extends PopoverTriggerProps {
    items: Store[];
}

const StoreSwitcher = ({
    className,
    items = [] // stores pertenecientes al usuario logueado
}: StoreSWitcherProps) => {

    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({ // formateamos de esta manera los stores
        label: item.name,
        value: item.id,
    }));

    const currentStore = formattedItems.find((item) => item.value === params.storeId); // Estará activo el store cuyo id coincida con el params de la url

    const [open, setOpen] = useState(false);    // Controla el estado del popover

    const onStoreSelect = (store: { value: string, label: string }) => { // Selecciona el id del store, cierra el combobox y te redirecciona /[storeId]
        setOpen(false);
        router.push(`/${store.value}`)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a store"
                    className={cn("w-[200px] justify-between", className)}
                >
                    <StoreIcon className="mr-2 h-4 w-4"/>
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search store..."/>
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading="Stores">
                            {
                                formattedItems.map((store) => (
                                    <CommandItem
                                        key={store.value}
                                        onSelect={() => onStoreSelect(store)} // Recibe el store seleccionado -> cierra el popover -> redirect /[storeId]
                                        className="text-sm"
                                    >
                                        <StoreIcon className="mr-2 h-4 w-4" />
                                        {store.label}
                                        <Check 
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                currentStore?.value === store.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))
                            }
                        </CommandGroup>
                    </CommandList>

                    <CommandSeparator />

                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false)
                                    storeModal.onOpen()
                                }}
                            >
                                <PlusCircle className="mr-2 h-5 w-5"/>
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default StoreSwitcher;
