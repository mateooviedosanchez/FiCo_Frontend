"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Combobox } from "@/components/ui/combobox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const metodosPago = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta" },
]

const formSchema = z.object({
  nombre: z.string().min(1, {
    message: "Ingresa el nombre del recibo de pago.",
  }),
  fecha: z.date(),
  metodoPago: z.string().min(1, {
    message: "Selecciona un método de pago.",
  }),
  total: z.coerce.number().positive({
    message: "El total debe ser mayor a 0.",
  }),
});

export function FormEditarRecibo({ initialData, receiptId }: { initialData?: any; receiptId: number }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData || {
      nombre: "",
      fecha: new Date(),
      metodoPago: "",
      total: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        id: receiptId,
        name: values.nombre,
        date: format(values.fecha, "yyyy-MM-dd"),
        total: values.total,
        paymentMethod: values.metodoPago,
        s3Key: initialData?.s3Key || "1k215",
        products: initialData?.productos || []
      };

      const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/editReceipt/${receiptId}/updateData`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el recibo");
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error al actualizar el recibo");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="border p-3 rounded-md space-y-2">
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
                    disabled={(date) => date > new Date()}
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

        <FormField
          control={form.control}
          name="total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total</FormLabel>
              <FormControl>
                <Input readOnly value={`$${(Number(field.value) || 0).toFixed(2)}`} className="bg-muted" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <div className="text-sm text-red-600 text-center">{error}</div>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Actualizando..." : "Actualizar Recibo"}
        </Button>
      </form>
    </Form>
  );
}