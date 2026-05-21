'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {

    const router = useRouter()

    const [email, setEmail] =
        useState('')

    const [password, setPassword] =
        useState('')

    const [loading, setLoading] =
        useState(false)

    async function login() {

        if (loading) return

        setLoading(true)

        const { error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            })

        if (error) {

            alert(error.message)

            setLoading(false)

            return
        }

        router.push('/')
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">

            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

                <div className="text-4xl font-black">
                    Payroll Login
                </div>

                <div className="text-zinc-500 mt-2">
                    Admin access only
                </div>

                <div className="space-y-4 mt-8">

                    <input
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Email"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-4"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Password"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-4"
                    />

                    <button
                        onClick={login}
                        disabled={loading}
                        className="
                            w-full
                            bg-white
                            text-black
                            rounded-2xl
                            py-4
                            font-semibold
                            disabled:opacity-50
                        "
                    >
                        {
                            loading
                                ? 'Loading...'
                                : 'Login'
                        }
                    </button>

                </div>

            </div>

        </div>
    )
}