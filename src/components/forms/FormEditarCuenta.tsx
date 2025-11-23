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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.profileImageUrl || null)
  const [uploadingImage, setUploadingImage] = useState(false)
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
    setAvatarPreview(user?.profileImageUrl || null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleUploadImage() {
    if (!avatarFile) {
      setError("Por favor selecciona una imagen primero")
      return
    }

    setError(null)
    setSuccess(null)
    setUploadingImage(true)

    try {
      // Convertir archivo a base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(avatarFile)
      })

      // Extraer extensión del archivo
      const fileExtension = avatarFile.name.split('.').pop() || 'jpg'

      // Llamar a Lambda para subir la imagen
      const lambdaUrl = import.meta.env.VITE_AWS_LAMBDA_UPLOAD_URL
      if (!lambdaUrl) {
        throw new Error('URL de Lambda no configurada. Agrega VITE_AWS_LAMBDA_UPLOAD_URL en tu archivo .env')
      }

      const uploadResponse = await fetch(lambdaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          userId: user?.id.toString(),
          fileType: fileExtension,
        }),
      })

      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen a S3')
      }

      const uploadData = await uploadResponse.json()
      
      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Error al subir la imagen')
      }

      const imageUrl = uploadData.imageUrl

      // Actualizar el perfil con la nueva imagen
      const updateData = {
        name: user?.name,
        email: user?.email,
        profileImageUrl: imageUrl
      }

      const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/editAccount/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la foto de perfil')
      }

      // Actualizar el contexto con la nueva imagen
      updateUser(user?.name || '', user?.email || '', imageUrl)
      
      setAvatarPreview(imageUrl)
      setSuccess("Foto de perfil actualizada correctamente")
      
      // Limpiar el archivo seleccionado
      setAvatarFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      setError(err.message || "Error al subir la imagen")
    } finally {
      setUploadingImage(false)
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
      // Actualizar solo nombre y email
      const updateData = {
        name,
        email,
        profileImageUrl: user?.profileImageUrl
      }

      const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/editAccount/${user?.id}`, {
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
      updateUser(name, email, user?.profileImageUrl)
      
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
              disabled={uploadingImage}
            >
              <IconCamera className="mr-2 h-4 w-4" />
              {avatarPreview ? 'Cambiar foto' : 'Agregar foto'}
            </Button>
            
            {avatarFile && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleUploadImage}
                disabled={uploadingImage}
              >
                {uploadingImage ? 'Subiendo...' : 'Guardar foto'}
              </Button>
            )}
            
            {avatarFile && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveAvatar}
                disabled={uploadingImage}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Cancelar
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
