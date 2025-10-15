import { AdminLogin } from "@/components/admin/admin-login"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        <AdminLogin />
      </div>
    </div>
  )
}