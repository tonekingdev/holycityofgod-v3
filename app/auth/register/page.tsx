import { RegisterForm } from "@/components/auth/register-form";
import FormImage from "@/components/FormImage";


export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
            <div className="container">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <FormImage />
                    </div>
                </div>
                <h1 className="text-3xl text-center font-bold text-gray-900">
                    Join Our Community
                </h1>
                <p className="text-gray-600 text-center mt-2">
                    Create an account to access member features
                </p>
            </div>
            <RegisterForm />
        </div>
    )
}