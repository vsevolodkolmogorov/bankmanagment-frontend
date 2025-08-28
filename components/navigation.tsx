"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, CreditCard, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { user, logout, isAdmin } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    setIsOpen(false) // Close mobile menu after selection
  }

  const navigationItems = [
    { key: "cards", label: "Мои карты", show: true },
    { key: "blocks", label: "Запросы на блокировку", show: true },
    { key: "transfer", label: "Переводы", show: true },
    { key: "admin-users", label: "Пользователи", show: isAdmin },
    { key: "admin-cards", label: "Все карты", show: isAdmin },
    { key: "admin-blocks", label: "Все блокировки", show: isAdmin },
  ]

  return (
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-base sm:text-xl font-bold truncate">Система банковских карт</h1>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navigationItems.map(
                  (item) =>
                      item.show && (
                          <Button
                              key={item.key}
                              variant={activeTab === item.key ? "default" : "ghost"}
                              onClick={() => onTabChange(item.key)}
                              size="sm"
                          >
                            {item.label}
                          </Button>
                      ),
              )}
            </div>

            {/* User Info and Logout - Desktop */}
            <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-32 sm:max-w-none">
              {user?.email} ({user?.roleName})
            </span>
              <Button variant="outline" onClick={logout} size="sm">
                Выйти
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="flex items-center space-x-2 lg:hidden">
              <span className="text-xs text-muted-foreground hidden sm:block">{user?.roleName}</span>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 sm:w-96">
                  <div className="flex flex-col h-full">
                    {/* User Profile Section */}
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-6 mt-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
                        <p className="text-xs text-blue-600 font-medium">{user?.roleName}</p>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
                        Навигация
                      </h3>
                      {navigationItems.map(
                          (item) =>
                              item.show && (
                                  <Button
                                      key={item.key}
                                      variant={activeTab === item.key ? "default" : "ghost"}
                                      onClick={() => handleTabChange(item.key)}
                                      className="w-full justify-start h-12 text-sm font-medium"
                                  >
                                    <CreditCard className="mr-3 h-4 w-4" />
                                    {item.label}
                                  </Button>
                              ),
                      )}
                    </div>

                    {/* Logout Button */}
                    <div className="border-t pt-4 mt-4">
                      <Button
                          variant="outline"
                          onClick={logout}
                          className="w-full h-12 text-sm font-medium border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Выйти из системы
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
  )
}
