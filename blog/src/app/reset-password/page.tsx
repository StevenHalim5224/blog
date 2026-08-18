"use client"

import { useRouter, useSearchParams } from "next/navigation";

import { Suspense, useState } from "react"

function ResetFormContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token")
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setIsError(false);

        if (newPassword !== confirmPassword) {
            setMessage("password didnt match");
            setIsError(true)
            setLoading(false)
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setIsError(false)

                setTimeout(() =>{
                    router.push("/login");
                }, 2000)
            } else {
                setMessage(data.message);
                setIsError(true)
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-grey-100">
                <h1 className="text-xl font-bold text-red-500">denied access, session has been expired</h1>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold  mb-6 text-center">Reset Password</h2>
                <p className="text-gray-600 mb-6 text-center text-sm">
                    Input your new Password
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                            placeholder="Minimal 6 character"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounder-md shadow-sm focus:outline-none focus:ring-block focus:border-black"
                            placeholder="Confirm New Password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounder-md shadow-sm test-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none disabled:bg-gray-400">
                        {loading ? "loading..." : "Save Changes"}
                    </button>
                </form>

                {message && (
                    <div className={`mt-4 text-center text-sm font-medium ${isError ? "text-red-500" : "text-green-500"}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    )
};

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>loading...</div>}>
            <ResetFormContent />
        </Suspense>
    )
}