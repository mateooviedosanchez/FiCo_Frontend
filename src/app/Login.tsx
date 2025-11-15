import { FormIniciarSesion } from "@/components/FormIniciarSesion"

const Login = () => {
  return (
    <div className="grid w-full min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
             <FormIniciarSesion />
           </div>
         </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/portada-login.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
export default Login
