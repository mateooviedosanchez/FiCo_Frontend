"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Combobox } from "@/components/ui/combobox";

const CATEGORIES = [
  { value: "alimentos", label: "Alimentos" },
  { value: "transporte", label: "Transporte" },
  { value: "servicios", label: "Servicios" },
]

const SUBCATEGORIES_MAP: Record<string, { value: string; label: string }[]> = {
  alimentos: [
    { value: "comida", label: "Comida" },
    { value: "snacks", label: "Snacks" },
  ],
  transporte: [
    { value: "bus", label: "Bus" },
    { value: "taxi", label: "Taxi" },
  ],
  servicios: [
    { value: "internet", label: "Internet" },
    { value: "telefono", label: "Teléfono" },
  ],
}

const formSchema = z.object({
  fecha: z.string().min(2, {
    message: "Selecciona la fecha del recibo de pago.",
  }),
  metodoPago: z.string().min(2, {
    message: "Selecciona al menos un metodo de pago.",
  }),
  productos: z
    .array(
      z.object({
        nombre: z
          .string()
          .min(1, { message: "Ingresa el nombre del producto." }),
        precio: z.coerce.number().nonnegative(),
        cantidad: z.coerce.number().int().positive(),
        categoria: z.string().min(1),
        subCategoria: z.string().min(1),
      })
    )
    .min(1, { message: "Agrega al menos un producto." }),
});

export function FormEntradaManual() {
  const form = useForm<z.infer<typeof formSchema>>({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolver: zodResolver(formSchema) as any,
    defaultValues: {
      fecha: "",
      metodoPago: "",
      productos: [
        { nombre: "", precio: 0, cantidad: 1, categoria: "", subCategoria: "" }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "productos",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="border p-3 rounded-md space-y-2">
        {/* sección recibo */}
        <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha</FormLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-[240px] justify-start text-left font-normal"
                    >
                      {field.value ? (
                        new Date(field.value).toLocaleDateString()
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date?.toISOString().split("T")[0])
                    }
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>

              <FormDescription>Ingresa la fecha del gasto.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="metodoPago"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metodo de Pago</FormLabel>
              <FormControl>
                <Input placeholder="Ej: debito" {...field} />
              </FormControl>
              <FormDescription>Ingresa el metodo de pago.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* sección productos */}
        {fields.map((field, index) => {
          const categoriaValue = form.watch(`productos.${index}.categoria`)
          const subItems = SUBCATEGORIES_MAP[categoriaValue] ?? []

          return (
          <div key={field.id} className="border p-3 rounded-md space-y-2">
            <FormField
              control={form.control}
              name={`productos.${index}.nombre`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`productos.${index}.precio`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Precio Unitario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`productos.${index}.cantidad`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Cantidad del Producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`productos.${index}.categoria`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Combobox
                      items={CATEGORIES}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Categoria"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`productos.${index}.subCategoria`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SubCategoria</FormLabel>
                  <FormControl>
                    <Combobox
                      items={subItems}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="SubCategoria"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" onClick={() => remove(index)}>
              Eliminar
            </Button>
          </div>
          )
        })}

        <Button
          type="button"
          className="w-full"
          onClick={
            () => append({ nombre: "", precio: 0, cantidad: 1, categoria: "", subCategoria: "" })
          }
        >
          Agregar producto
        </Button>

        <Button type="submit" className="w-full">Enviar</Button>
      </form>
    </Form>
  );
}
