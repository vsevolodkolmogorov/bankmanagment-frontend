"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { api, type CardResponse, type PageResponse, type UserResponse } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Plus, Search, Trash2 } from "lucide-react"

export function AdminCardsTab() {
  const [cards, setCards] = useState<PageResponse<CardResponse> | null>(null)
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<{
    lastFourDigits: string | null
    status: string | null
    minBalance: string | null
    maxBalance: string | null
  }>({
    lastFourDigits: null,
    status: null,
    minBalance: null,
    maxBalance: null,
  })
  const [page, setPage] = useState(0)
  const [searchKey, setSearchKey] = useState(0)
  const [newCard, setNewCard] = useState({
    userId: "",
    expiryDate: "",
    status: "ACTIVE",
    balance: "",
  })
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  const loadCards = async (filtersToUse = filters) => {
    try {
      setLoading(true)
      const response = await api.getAllCards(page, 10, filtersToUse)
      setCards(response)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не получилось загрузить карты";

      toast({
        title: "Ошибка",
        description: message
      })
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await api.getUsers(0, 100)
      setUsers(response.content)
    } catch (error) {
      console.error("Не получилось загрузить пользователей")
    }
  }

  useEffect(() => {
    loadCards()
    loadUsers()
  }, [page, searchKey])


  const handleClearFilters = () => {
    const clearedFilters = {
      lastFourDigits: null,
      status: null,
      minBalance: "",
      maxBalance: "",
    }
    setFilters(clearedFilters)
    setPage(0)
    setSearchKey((prev) => prev + 1)
    loadCards(clearedFilters)
  }

  const handleSearch = () => {
    setPage(0)
    setSearchKey((prev) => prev + 1)
  }

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.createCard({
        userId: Number.parseInt(newCard.userId),
        expiryDate: newCard.expiryDate,
        status: newCard.status,
        balance: Number.parseFloat(newCard.balance),
      })
      toast({
        title: "Успешно",
        description: "Карта успешно создана",
      })
      setNewCard({ userId: "", expiryDate: "", status: "ACTIVE", balance: "" })
      setCreateDialogOpen(false)
      loadCards()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не получилось создать карту";

      toast({
        title: "Ошибка",
        description: message,
      })
    }
  }

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.updateCardStatus(id, status)
      toast({
        title: "Успешно",
        description: "Статус карты обновлен",
      })
      loadCards()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не получилось обновить статус карты";

      toast({
        title: "Ошибка",
        description: message,
      })
    }
  }

  const handleDeleteCard = async (id: number) => {
    if (!confirm("Вы уверены что хотите удалить карту?")) return

    try {
      await api.deleteCard(id)
      toast({
        title: "Успешно",
        description: "Карта удалено успешно",
      })
      loadCards()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось удалить карту";

      toast({
        title: "Ошибка",
        description: message,
      })
    }
  }

  if (loading && !cards) {
    return <div className="text-center py-8 text-sm sm:text-base">Загрузка карт...</div>
  }

  return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <span>Управление картами</span>
          </h2>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base">
                <Plus className="mr-2 h-4 w-4" />
                Создать карту
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">Создать новую карту</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCard} className="space-y-4">
                <Select value={newCard.userId} onValueChange={(value) => setNewCard({ ...newCard, userId: value })}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Выберите пользователя" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          <span className="text-sm truncate">{user.email}</span>
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                    type="month"
                    placeholder="Дата истечения"
                    value={newCard.expiryDate}
                    onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                    required
                    className="text-sm sm:text-base"
                />
                <Select value={newCard.status} onValueChange={(value) => setNewCard({ ...newCard, status: value })}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Активна</SelectItem>
                    <SelectItem value="BLOCKED">Заблокирована</SelectItem>
                    <SelectItem value="EXPIRED">Истекла</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                    type="number"
                    step="0.01"
                    placeholder="Начальный баланс"
                    value={newCard.balance}
                    onChange={(e) => setNewCard({ ...newCard, balance: e.target.value })}
                    required
                    className="text-sm sm:text-base"
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base">
                  Создать карту
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-blue-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span>Фильтры поиска</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Input
                  placeholder="Последние 4 цифры"
                  value={filters.lastFourDigits}
                  onChange={(e) => setFilters({...filters, lastFourDigits: e.target.value})}
                  className="text-sm sm:text-base"
              />
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Статус"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Активные</SelectItem>
                  <SelectItem value="BLOCKED">Заблокированные</SelectItem>
                  <SelectItem value="EXPIRED">Истекшие</SelectItem>
                </SelectContent>
              </Select>
              <Input
                  type="number"
                  placeholder="Мин. баланс"
                  value={filters.minBalance}
                  onChange={(e) => setFilters({...filters, minBalance: e.target.value})}
                  className="text-sm sm:text-base"
              />
              <Input
                  type="number"
                  placeholder="Макс. баланс"
                  value={filters.maxBalance}
                  onChange={(e) => setFilters({...filters, maxBalance: e.target.value})}
                  className="text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
                <Search className="mr-2 h-4 w-4" />
                Поиск
              </Button>
              <Button onClick={handleClearFilters} variant="outline" className="flex-1 sm:flex-none bg-transparent">
                Очистить фильтры
              </Button>
            </div>
          </CardContent>
        </Card>

        {cards && cards.content.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="text-center py-8 sm:py-12 px-4">
                <CreditCard className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Карты не найдены</h3>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                  {Object.values(filters).some((f) => f !== "")
                      ? "Попробуйте изменить фильтры поиска для поиска карт."
                      : "В системе пока нет карт. Создайте первую карту для начала работы."}
                </p>
              </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {cards?.content.map((card) => (
                  <Card key={card.id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                        <span className="truncate">{card.maskedCardNumber}</span>
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm leading-tight">
                        Владелец: <span className="truncate inline-block max-w-24 sm:max-w-none">{card.ownerEmail}</span>
                        <br />
                        Истекает: {card.expiryDate}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <span className="text-sm sm:text-base">Статус:</span>
                          <Select value={card.statusName} onValueChange={(value) => handleUpdateStatus(card.id, value)}>
                            <SelectTrigger className="w-full sm:w-32 text-xs sm:text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">Активна</SelectItem>
                              <SelectItem value="BLOCKED">Заблокирована</SelectItem>
                              <SelectItem value="EXPIRED">Истекла</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">Баланс:</span>
                          <span className="font-medium text-sm sm:text-base">${card.balance.toFixed(2)}</span>
                        </div>

                        <Button
                            onClick={() => handleDeleteCard(card.id)}
                            variant="outline"
                            size="sm"
                            className="w-full mt-3 sm:mt-4 border-red-300 text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                        >
                          <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Удалить карту
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
        )}

        {cards && cards.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Button onClick={() => setPage(page - 1)} disabled={page === 0} variant="outline" size="sm">
                Предыдущая
              </Button>
              <span className="py-2 px-4 text-sm sm:text-base">
            Страница {page + 1} из {cards.totalPages}
          </span>
              <Button onClick={() => setPage(page + 1)} disabled={page >= cards.totalPages - 1} variant="outline" size="sm">
                Следующая
              </Button>
            </div>
        )}
      </div>
  )
}
