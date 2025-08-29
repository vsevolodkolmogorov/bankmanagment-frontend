"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api, type CardResponse } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ArrowRightLeft, CreditCard } from "lucide-react"

export function TransferTab() {
  const [cards, setCards] = useState<CardResponse[]>([])
  const [fromCardId, setFromCardId] = useState("")
  const [toCardId, setToCardId] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [cardsLoading, setCardsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadCards = async () => {
      try {
        setCardsLoading(true)
        const response = await api.getUserCards(0, 100)
        setCards(response.content)
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить карты"
        })
      } finally {
        setCardsLoading(false)
      }
    }
    loadCards()
  }, [])

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fromCardId || !toCardId || !amount) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля"
      })
      return
    }

    if (fromCardId === toCardId) {
      toast({
        title: "Ошибка",
        description: "Нельзя переводить на ту же карту",
      })
      return
    }

    try {
      setLoading(true)
      await api.transferBetweenCards({
        fromCardId: Number.parseInt(fromCardId),
        toCardId: Number.parseInt(toCardId),
        amount: Number.parseFloat(amount),
      })
      toast({
        title: "Успешно",
        description: "Перевод выполнен успешно",
      })
      setFromCardId("")
      setToCardId("")
      setAmount("")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Перевод не удался"

      toast({
        title: "Ошибка",
        description: message
      })
    } finally {
      setLoading(false)
    }
  }

  if (cardsLoading) {
    return <div className="text-center py-8 text-sm sm:text-base">Загрузка карт...</div>
  }

  if (cards.length === 0) {
    return (
        <div className="max-w-sm sm:max-w-md mx-auto px-4">
          <Card className="border-gray-200">
            <CardContent className="text-center py-8 sm:py-12">
              <CreditCard className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Нет доступных карт</h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Для переводов между картами необходимо иметь минимум 2 карты.
              </p>
            </CardContent>
          </Card>
        </div>
    )
  }

  if (cards.length < 2) {
    return (
        <div className="max-w-sm sm:max-w-md mx-auto px-4">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="text-center py-8 sm:py-12">
              <ArrowRightLeft className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-yellow-800 mb-2">Нужно больше карт</h3>
              <p className="text-yellow-700 text-sm sm:text-base leading-relaxed">
                Для переводов необходимо минимум 2 карты. У вас сейчас {cards.length} карта.
              </p>
            </CardContent>
          </Card>
        </div>
    )
  }

  return (
      <div className="max-w-sm sm:max-w-md mx-auto px-4">
        <Card className="border-blue-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <ArrowRightLeft className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span>Перевод между картами</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTransfer} className="space-y-4 sm:space-y-5">
              <div>
                <label className="text-sm font-medium block mb-2">С карты</label>
                <Select value={fromCardId} onValueChange={setFromCardId}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Выберите карту отправителя" />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((card) => (
                        <SelectItem key={card.id} value={card.id.toString()}>
                      <span className="text-sm">
                        {card.maskedCardNumber} (${card.balance.toFixed(2)})
                      </span>
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">На карту</label>
                <Select value={toCardId} onValueChange={setToCardId}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Выберите карту получателя" />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((card) => (
                        <SelectItem key={card.id} value={card.id.toString()}>
                      <span className="text-sm">
                        {card.maskedCardNumber} (${card.balance.toFixed(2)})
                      </span>
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Сумма</label>
                <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Введите сумму"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="text-sm sm:text-base"
                />
              </div>

              <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-2 sm:py-3"
                  disabled={loading}
              >
                {loading ? "Обработка..." : "Перевести"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  )
}
