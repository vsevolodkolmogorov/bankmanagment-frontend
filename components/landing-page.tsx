"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Shield, Users, ArrowRight, CheckCircle } from "lucide-react"

interface LandingPageProps {
    onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <CreditCard className="h-8 w-8 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Система управления картами</h1>
                    </div>
                    <Button onClick={onGetStarted} className="bg-blue-600 hover:bg-blue-700">
                        Начать
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-5xl font-bold text-gray-900 mb-6">Система управления банковскими картами</h2>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Добро пожаловать в проект Card Management System — backend-приложение для управления банковскими картами,
                        разработанное на Java 17 и Spring Boot. Оно обеспечивает создание, управление и переводы между картами с
                        ролевым доступом для администраторов и пользователей.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        <Badge variant="secondary" className="px-4 py-2 text-sm">
                            Java 17
                        </Badge>
                        <Badge variant="secondary" className="px-4 py-2 text-sm">
                            Spring Boot
                        </Badge>
                        <Badge variant="secondary" className="px-4 py-2 text-sm">
                            Spring Security
                        </Badge>
                        <Badge variant="secondary" className="px-4 py-2 text-sm">
                            JWT
                        </Badge>
                        <Badge variant="secondary" className="px-4 py-2 text-sm">
                            Swagger
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Возможности системы</h3>

                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Admin Features */}
                    <Card className="border-2 border-amber-200 bg-amber-50">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Shield className="h-8 w-8 text-amber-600" />
                                <div>
                                    <CardTitle className="text-2xl text-amber-800">👑 Администратор</CardTitle>
                                    <CardDescription className="text-amber-700">Полный контроль над системой</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-amber-600" />
                                <span className="text-amber-800">Создание, блокировка, активация и удаление карт</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-amber-600" />
                                <span className="text-amber-800">Управление пользователями: создание, изменение ролей</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-amber-600" />
                                <span className="text-amber-800">Блокировка/активация пользователей</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-amber-600" />
                                <span className="text-amber-800">Просмотр всех карт в системе</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Features */}
                    <Card className="border-2 border-blue-200 bg-blue-50">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Users className="h-8 w-8 text-blue-600" />
                                <div>
                                    <CardTitle className="text-2xl text-blue-800">👤 Пользователь</CardTitle>
                                    <CardDescription className="text-blue-700">Управление личными картами</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-800">Просмотр своих карт с поиском и пагинацией</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-800">Запрос на блокировку карты</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-800">Перевод средств между своими картами</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-800">Проверка баланса</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Card Features */}
            <section className="container mx-auto px-4 py-16">
                <Card className="max-w-4xl mx-auto border-2 border-green-200 bg-green-50">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-green-800 flex items-center justify-center space-x-2">
                            <CreditCard className="h-6 w-6" />
                            <span>💳 Атрибуты карты</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-start space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                    <div>
                                        <span className="font-medium text-green-800">Номер карты:</span>
                                        <p className="text-sm text-green-700">Зашифрован, отображается в формате **** **** **** 1234</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                    <div>
                                        <span className="font-medium text-green-800">Владелец:</span>
                                        <p className="text-sm text-green-700">Логин пользователя</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                    <div>
                                        <span className="font-medium text-green-800">Срок действия:</span>
                                        <p className="text-sm text-green-700">Формат yyyy-MM</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                    <div>
                                        <span className="font-medium text-green-800">Статус:</span>
                                        <p className="text-sm text-green-700">Активна, Заблокирована, Истек срок</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Login Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8">Начать работу</h3>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <Card className="border-2 border-amber-200 bg-amber-50">
                            <CardHeader>
                                <CardTitle className="text-amber-800">Вход для администратора</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-amber-700">Используйте тестовые данные:</p>
                                <div className="bg-amber-100 p-3 rounded-md">
                                    <p className="font-mono text-sm text-amber-800">admin@gmail.com</p>
                                    <p className="font-mono text-sm text-amber-800">Passw0rd*</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-blue-200 bg-blue-50">
                            <CardHeader>
                                <CardTitle className="text-blue-800">Регистрация пользователя</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-blue-700">
                                    Создайте новый аккаунт пользователя для доступа к функциям управления картами
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Button onClick={onGetStarted} size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                        Войти в систему
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400">
                        Система управления картами - Безопасное управление банковскими картами с ролевым доступом
                    </p>
                </div>
            </footer>
        </div>
    )
}
