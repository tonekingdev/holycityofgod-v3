import { RegisterForm } from "@/components/auth/register-form"
import Image from "next/image"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative h-20 w-20 bg-white rounded-full p-1 shadow-md">
              <Image
                src="/images/church-logo.png"
                alt="Holy City of God Christian Fellowship"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Join Our Community</h1>
          <p className="text-gray-600 mt-2">Create an account to access member features</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
