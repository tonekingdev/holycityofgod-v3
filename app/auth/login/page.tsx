import { LoginForm } from "@/components/auth/login-form";
import FormImage from "@/components/FormImage";


export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
            <div className="container">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <FormImage />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Sign in to your Holy City of God account
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}