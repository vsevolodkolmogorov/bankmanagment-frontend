"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api, type CardResponse, type PageResponse } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import {CreditCard, Search} from "lucide-react";

export function CardsTab() {
  const [cards, setCards] = useState<PageResponse<CardResponse> | null>(null)
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
  const { toast } = useToast()

  const loadCards = async () => {
    try {
      setLoading(true)
      const response = await api.getUserCards(page, 10, filters)
      setCards(response)
    } catch (error) {
      const message = error instanceof Error ? error.message :  "Не удалось загрузить карты"

      toast({
        title: "Ошибка",
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadCards()
  }, [page])

  const handleSearch = () => {
    setPage(0)
    loadCards()
  }

  const handleBlockRequest = async (cardId: number) => {
    try {
      await api.createCardBlock(cardId)
      toast({
        title: "Успешно",
        description: "Запрос на блокировку создан успешно",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message :  "Не удалось создать запрос на блокировку"

      toast({
        title: "Ошибка",
        description: message,
      })
    }
  }

  if (loading && !cards) {
    return <div className="text-center py-8">Загрузка карт...</div>
  }

  return (
      <div className="space-y-6">
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
                      : "У вас пока нет карт."}
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
                      <CardDescription>Истекает: {card.expiryDate}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Статус:</span>
                          <span
                              className={`font-medium px-2 py-1 rounded-full text-xs ${
                                  card.statusName === "ACTIVE"
                                      ? "bg-green-100 text-green-700"
                                      : card.statusName === "BLOCKED"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                      {card.statusName === "ACTIVE"
                          ? "Активна"
                          : card.statusName === "BLOCKED"
                              ? "Заблокирована"
                              : "Истекла"}
                    </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Баланс:</span>
                          <span className="font-medium">${card.balance.toFixed(2)}</span>
                        </div>
                        <Button
                            onClick={() => handleBlockRequest(card.id)}
                            variant="outline"
                            size="sm"
                            className="w-full mt-4 border-orange-300 text-orange-700 hover:bg-orange-50"
                            disabled={card.statusName === "BLOCKED"}
                        >
                          Запросить блокировку
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