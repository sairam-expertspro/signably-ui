"use client"

import { useState } from "react"
import { useLoginMutation } from "@/src/features/auth/authApi"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    try {
      const response = await login({ email, password }).unwrap()

      localStorage.setItem("token", response.access_token)

      router.push("/dashboard")
    } catch (error) { 
      console.error("Login failed", error)
    }
  }

  return (
  <>
  </>
  )
}