"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type SizeColumn = { // Definiciones de cada elemento de []data.
    id: string
    name: string
    value: string
    createdAt: string
}

export const columns: ColumnDef<SizeColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "value",
        header: "Value",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={ row.original } />
    }
    
]
