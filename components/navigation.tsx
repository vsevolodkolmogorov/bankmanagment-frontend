"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { user, logout, isAdmin } = useAuth()

  return (
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Система банковских карт</h1>
              <div className="flex space-x-2">
                <Button variant={activeTab === "cards" ? "default" : "ghost"} onClick={() => onTabChange("cards")}>
                  Мои карты
                </Button>
                <Button variant={activeTab === "blocks" ? "default" : "ghost"} onClick={() => onTabChange("blocks")}>
                  Запросы на блокировку
                </Button>
                <Button variant={activeTab === "transfer" ? "default" : "ghost"} onClick={() => onTabChange("transfer")}>
                  Переводы
                </Button>
                {isAdmin && (
                    <>
                      <Button
                          variant={activeTab === "admin-users" ? "default" : "ghost"}
                          onClick={() => onTabChange("admin-users")}
                      >
                        Пользователи
                      </Button>
                      <Button
                          variant={activeTab === "admin-cards" ? "default" : "ghost"}
                          onClick={() => onTabChange("admin-cards")}
                      >
                        Все карты
                      </Button>
                      <Button
                          variant={activeTab === "admin-blocks" ? "default" : "ghost"}
                          onClick={() => onTabChange("admin-blocks")}
                      >
                        Все блокировки
                      </Button>
                    </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {user?.email} ({user?.roleName})
            </span>
              <Button variant="outline" onClick={logout}>
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}
