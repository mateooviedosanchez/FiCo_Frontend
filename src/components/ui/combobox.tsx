"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Keep example frameworks array for quick dev/testing if needed; not used by default.

type Item = { value: string; label: string }

type ComboboxProps = {
  items: Item[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function Combobox({ items, value, onChange, placeholder = "Selecciona...", className }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const internalValue = value ?? ""

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {internalValue
            ? items.find((it) => it.value === internalValue)?.label
            : placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={`Buscar ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No encontrado.</CommandEmpty>
            <CommandGroup>
              {items.map((it) => (
                <CommandItem
                  key={it.value}
                  value={it.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === internalValue ? "" : currentValue
                    onChange?.(newValue)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      internalValue === it.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {it.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}