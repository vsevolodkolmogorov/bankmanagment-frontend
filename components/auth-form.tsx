"use client"

import type React from "react"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {useAuth} from "@/contexts/auth-context"
import {useToast} from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

interface AuthFormProps {
    onBack?: () => void
}

export function AuthForm({ onBack }: AuthFormProps)  {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const {login, register} = useAuth()
    const {toast} = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isLogin) {
                await login(email, password)
            } else {
                await register(email, password)
            }
            toast({
                title: isLogin ? "Успешный вход" : "Успешная регистрация",
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : "Что-то пошло не так"

            toast({
                title: "Ошибка",
                description: message
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto border-blue-200">
            {onBack && (
                <div className="p-4 pb-0">
                    <Button variant="ghost" onClick={onBack} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        На главную
                    </Button>
                </div>
            )}
            <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl sm:text-2xl">{isLogin ? "Вход" : "Регистрация"}</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                    {isLogin ? "Введите ваши данные для входа в аккаунт" : "Создайте новый аккаунт"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input type="email" placeholder="Почта" value={email} onChange={(e) => setEmail(e.target.value)}
                               required className="text-sm sm:text-base py-2 sm:py-3"/>
                    </div>
                    <div>
                        <Input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="text-sm sm:text-base py-2 sm:py-3"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-2 sm:py-3"
                        disabled={loading}
                    >
                        {loading ? "Загрузка..." : isLogin ? "Вход" : "Регистрация"}
                    </Button>
                </form>
                <div className="mt-4 text-center">
                    <Button
                        variant="link"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-700"
                    >
                        {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
