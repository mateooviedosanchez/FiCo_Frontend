"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Combobox } from "@/components/ui/combobox";
import { CalendarIcon, Plus, Trash2Icon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Categorías y Subcategorías:
// 	Alimentos:
// 		Comida
// 		Comida chatarra
// 	Salud:
// 		Medicamentos
// 		Cuidado personal
// 	Transporte:
// 		Combustible
// 		Mantenimiento
// 		Transporte publico
// 	Entretenimiento:
// 		Tecnología
// 		Películas
// 		Deporte
// 		Recreativos
// 		Streaming
// 	Servicios:
// 		Del hogar
// 	Otros -> Input (El usuario escoge a que categoría corresponde):
// 		Subcategoría -> Input (El usuario escoge a que categoría corresponde)

const categories = [
  { value: "alimentos", label: "Alimentos" },
  { value: "salud", label: "Salud" },
  { value: "transporte", label: "Transporte" },
  { value: "entretenimiento", label: "Entretenimiento" },
  { value: "servicios", label: "Servicios" },
  { value: "otros", label: "Otros" },
]

const metodosPago = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta" },
]

const subcategories_map: Record<string, { value: string; label: string }[]> = {
  alimentos: [
    { value: "comida", label: "Comida" },
    { value: "comida_chatarra", label: "Comida Chatarra" },
  ],
  salud: [
    { value: "medicamentos", label: "Medicamentos" },
    { value: "cuidado_personal", label: "Cuidado personal" },
  ],
  transporte: [
    { value: "combustible", label: "Combustible" },
    { value: "mantenimiento", label: "Mantenimiento" },
    { value: "transporte_publico", label: "Transporte público" },
  ],
  entretenimiento: [
    { value: "tecnologia", label: "Tecnología" },
    { value: "peliculas", label: "Películas" },
    { value: "deporte", label: "Deporte" },
    { value: "recreativos", label: "Recreativos" },
    { value: "streaming", label: "Streaming" },
  ],
  servicios: [
    { value: "hogar", label: "Del hogar" },
  ],
  otros: [
    { value: "categoria_personalizada", label: "Categoría personalizada" },
  ],
}

const formSchema = z.object({
  nombre: z.string().min(1, {
    message: "Selecciona el nombre del recibo de pago.",
  }),
  fecha: z.date().min(2, {
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
  total: z.coerce.number(),
});

export function FormEntradaManual() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      nombre: "",
      fecha: new Date(),
      metodoPago: "",
      productos: [
        { nombre: "", precio: 0, cantidad: 1, categoria: "", subCategoria: "" }
      ],
      total: 0,
    },
  });

  const navigate = useNavigate();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "productos",
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.startsWith('productos')) {
        const productos = value.productos || [];
        const total = productos.reduce((acc, p) => {
          const precio = Number(p?.precio) || 0;
          const cantidad = Number(p?.cantidad) || 0;
          return acc + precio * cantidad;
        }, 0);
        form.setValue("total", total);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedValues = {
      ...values,
      fecha: format(values.fecha, "dd/MM/yyyy")
    };
    console.log(formattedValues);
    navigate("/dashboard");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="border p-3 rounded-md space-y-2">
        {/* sección recibo */}
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Oxxo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-base-bold">Fecha</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una opción</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
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
                <Combobox
                  items={metodosPago}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Selecciona una opción"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* sección productos */}
        <h2 className="text-xl font-semibold">Productos</h2>
        {fields.map((field, index) => {
          const categoriaValue = form.watch(`productos.${index}.categoria`)
          const subItems = subcategories_map[categoriaValue] ?? []

          return (
            <div key={field.id} className="border p-3 rounded-md space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`productos.${index}.nombre`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Pepsi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`productos.${index}.precio`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio Unitario</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input type="number" placeholder="0" {...field} className="pl-7" />
                          </div>
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
                        <FormLabel>Cantidad del Producto</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`productos.${index}.categoria`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Combobox
                          items={categories}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Selecciona una categoria"
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
                          placeholder="Selecciona una subcategoria"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="button" variant="destructive" onClick={() => remove(index)}>
                Eliminar
                <Trash2Icon className="ml-auto h-4 w-4 " />
              </Button>
            </div>
          )
        })}

        <Button
          type="button"
          className="w-full"
          variant="secondary"
          onClick={
            () => append({ nombre: "", precio: 0, cantidad: 1, categoria: "", subCategoria: "" })
          }
        >
          Agregar producto al recibo
          <Plus />
        </Button>

        <FormField
          control={form.control}
          name="total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total</FormLabel>
              <FormControl>
                <Input readOnly value={`$${(Number(field.value) || 0).toFixed(2)}`} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Agregar Recibo</Button>
      </form>
    </Form>
  );
}
