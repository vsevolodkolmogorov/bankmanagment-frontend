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
  const [newCard, setNewCard] = useState({
    userId: "",
    expiryDate: "",
    status: "ACTIVE",
    balance: "",
  })
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  const loadCards = async () => {
    try {
      setLoading(true)
      const response = await api.getAllCards(page, 10, filters)
      setCards(response)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не получилось загрузить карты"
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
  }, [page])

  const handleSearch = () => {
    setPage(0)
    loadCards()
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
      toast({
        title: "Ошибка",
        description: "Не получилось создать карту",
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
      toast({
        title: "Ошибка",
        description: "Не получилось обновить статус карты",
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
      toast({
        title: "Ошибка",
        description: "Не удалось удалить карту",
      })
    }
  }

  if (loading && !cards) {
    return <div className="text-center py-8">Загрузка карт...</div>
  }

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <span>Управление картами</span>
          </h2>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Создать карту
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать новую карту</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCard} className="space-y-4">
                <Select value={newCard.userId} onValueChange={(value) => setNewCard({ ...newCard, userId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите пользователя" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.email}
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
                />
                <Select value={newCard.status} onValueChange={(value) => setNewCard({ ...newCard, status: value })}>
                  <SelectTrigger>
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
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Создать карту
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-blue-600" />
              <span>Фильтры поиска</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                  placeholder="Последние 4 цифры"
                  value={filters.lastFourDigits}
                  onChange={(e) => setFilters({ ...filters, lastFourDigits: e.target.value })}
              />
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Все</SelectItem>
                  <SelectItem value="ACTIVE">Активные</SelectItem>
                  <SelectItem value="BLOCKED">Заблокированные</SelectItem>
                  <SelectItem value="EXPIRED">Истекшие</SelectItem>
                </SelectContent>
              </Select>
              <Input
                  type="number"
                  placeholder="Мин. баланс"
                  value={filters.minBalance}
                  onChange={(e) => setFilters({ ...filters, minBalance: e.target.value })}
              />
              <Input
                  type="number"
                  placeholder="Макс. баланс"
                  value={filters.maxBalance}
                  onChange={(e) => setFilters({ ...filters, maxBalance: e.target.value })}
              />
            </div>
            <Button onClick={handleSearch} className="mt-4 bg-blue-600 hover:bg-blue-700">
              <Search className="mr-2 h-4 w-4" />
              Поиск
            </Button>
          </CardContent>
        </Card>

        {cards && cards.content.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="text-center py-12">
                <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Карты не найдены</h3>
                <p className="text-gray-500">
                  {Object.values(filters).some((f) => f !== "" && f !== "ALL")
                      ? "Попробуйте изменить фильтры поиска для поиска карт."
                      : "В системе пока нет карт. Создайте первую карту для начала работы."}
                </p>
              </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards?.content.map((card) => (
                  <Card key={card.id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <span>{card.maskedCardNumber}</span>
                      </CardTitle>
                      <CardDescription>
                        Владелец: {card.ownerEmail} | Истекает: {card.expiryDate}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Статус:</span>
                          <Select value={card.statusName} onValueChange={(value) => handleUpdateStatus(card.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">Активна</SelectItem>
                              <SelectItem value="BLOCKED">Заблокирована</SelectItem>
                              <SelectItem value="EXPIRED">Истекла</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-between">
                          <span>Баланс:</span>
                          <span className="font-medium">${card.balance.toFixed(2)}</span>
                        </div>

                        <Button
                            onClick={() => handleDeleteCard(card.id)}
                            variant="outline"
                            size="sm"
                            className="w-full mt-4 border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Удалить карту
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
        )}

        {cards && cards.totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button onClick={() => setPage(page - 1)} disabled={page === 0} variant="outline">
                Предыдущая
              </Button>
              <span className="py-2 px-4">
            Страница {page + 1} из {cards.totalPages}
          </span>
              <Button onClick={() => setPage(page + 1)} disabled={page >= cards.totalPages - 1} variant="outline">
                Следующая
              </Button>
            </div>
        )}
      </div>
  )
}
