"use client"

import { Suspense, useState } from "react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setIsError(false)

        try{
            const res = await fetch("http://localhost:3000/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Link reset password has been sent to your email");
                setIsError(false)
            }else {
                setMessage(data.message || "failed sent link");
                setIsError(true)
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
            setIsError(true)
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className= "text-2xl font-bold  mb-6 text-center">Forgot Password</h2>
            <p className="text-gray-600 mb-6 text-center text-sm">
                Input your email
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    placeholder="YourEmail@gmail.com"
                    />
                </div>

                <button 
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounder-md shadow-sm test-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none disabled:bg-gray-400">
                    {loading? "loading...": "Send Reset Link"}
                </button>
            </form>

            {message && (
                <div className={`mt-4 text-center text-sm font-medium ${isError ? "text-red-500" : "text-green-600"}`}>
                    {message}
                </div>
            )}
        </div>
    </div>
)
};
