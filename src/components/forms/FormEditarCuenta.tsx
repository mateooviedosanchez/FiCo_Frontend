import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState, useRef } from "react"
import { useAuth } from "@/context/AuthProvider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconCamera, IconTrash } from "@tabler/icons-react"

export function FormEditarCuenta({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido')
        return
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar los 5MB')
        return
      }

      setAvatarFile(file)
      
      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name || !email) {
      setError("El nombre y el correo son obligatorios")
      return
    }

    setLoading(true)
    try {
      let s3Key = undefined

      // Si hay un archivo de avatar, primero subirlo para obtener la s3Key
      if (avatarFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('avatar', avatarFile)
        
        // Endpoint para subir la imagen y obtener la s3Key, hay que ajustar el nombre de la api
        const uploadResponse = await fetch(`${import.meta.env.VITE_API_BACKEND}/upload-avatar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Error al subir la imagen')
        }

        const uploadData = await uploadResponse.json()
        s3Key = uploadData.s3Key // Asumiendo que el backend retorna { s3Key: "..." }
      }

      // Actualizar el perfil con los datos en formato JSON
      const updateData: { name: string; email: string; s3Key?: string } = {
        name,
        email,
      }

      if (s3Key) {
        updateData.s3Key = s3Key
      }

      const response = await fetch(`http://localhost:8080/api/editAccount/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil')
      }

      // Actualizar el contexto de autenticación con los nuevos datos
      updateUser(name, email)
      
      setSuccess("Perfil actualizado correctamente")
    } catch (err: any) {
      setError(err.message || "Error al actualizar el perfil")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        {/* Foto de perfil */}
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <AvatarImage src={avatarPreview || undefined} alt={name} />
            <AvatarFallback className="text-2xl">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <IconCamera className="mr-2 h-4 w-4" />
              {avatarPreview ? 'Cambiar foto' : 'Agregar foto'}
            </Button>
            
            {avatarPreview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveAvatar}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          
          <FieldDescription className="text-center">
            Formatos aceptados: JPG, PNG, GIF. Máximo 5MB.
          </FieldDescription>
        </div>

        <Field>
          <FieldLabel htmlFor="name">Nombre completo</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        
        <Field>
          <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        {error && <div className="text-sm text-red-600 px-3">{error}</div>}
        {success && <div className="text-sm text-green-600 px-3">{success}</div>}

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default FormEditarCuenta
