"use client"

import { useState } from "react"
import { AuthForm } from "@/components/auth-form"
import { Navigation } from "@/components/navigation"
import { CardsTab } from "@/components/cards-tab"
import { BlocksTab } from "@/components/blocks-tab"
import { TransferTab } from "@/components/transfer-tab"
import { AdminUsersTab } from "@/components/admin-users-tab"
import { AdminCardsTab } from "@/components/admin-cards-tab"
import { AdminBlocksTab } from "@/components/admin-blocks-tab"
import { LandingPage } from "@/components/landing-page"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

function AppContent() {
    const { user, loading } = useAuth()
    const [activeTab, setActiveTab] = useState("cards")
    const [showAuth, setShowAuth] = useState(false)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base">Загрузка...</p>
                </div>
            </div>
        )
    }

    if (!user && !showAuth) {
        return <LandingPage onGetStarted={() => setShowAuth(true)} />
    }

    if (!user && showAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
                <div className="w-full max-w-md">
                    <AuthForm />
                </div>
            </div>
        )
    }

    const renderActiveTab = () => {
        switch (activeTab) {
            case "cards":
                return <CardsTab />
            case "blocks":
                return <BlocksTab />
            case "transfer":
                return <TransferTab />
            case "admin-users":
                return <AdminUsersTab />
            case "admin-cards":
                return <AdminCardsTab />
            case "admin-blocks":
                return <AdminBlocksTab />
            default:
                return <CardsTab />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="container mx-auto px-4 py-4 sm:py-8">{renderActiveTab()}</div>
        </div>
    )
}

export default function Home() {
    return (
        <AuthProvider>
            <AppContent />
            <Toaster />
        </AuthProvider>
    )
}
