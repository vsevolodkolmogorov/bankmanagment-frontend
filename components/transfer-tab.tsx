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
        const message = error instanceof Error ? error.message :  "Не удалось загрузить карты"

        toast({
          title: "Ошибка",
          description: message
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
        description: "Нельзя переводить на ту же карту"
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
      const message = error instanceof Error ? error.message :  "Перевод не удался";

      toast({
        title: "Ошибка",
        description: message
      })
    } finally {
      setLoading(false)
    }
  }

  if (cardsLoading) {
    return <div className="text-center py-8">Загрузка карт...</div>
  }

  if (cards.length === 0) {
    return (
        <div className="max-w-md mx-auto">
          <Card className="border-gray-200">
            <CardContent className="text-center py-12">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Нет доступных карт</h3>
              <p className="text-gray-500">Для переводов между картами необходимо иметь минимум 2 карты.</p>
            </CardContent>
          </Card>
        </div>
    )
  }

  if (cards.length < 2) {
    return (
        <div className="max-w-md mx-auto">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="text-center py-12">
              <ArrowRightLeft className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Нужно больше карт</h3>
              <p className="text-yellow-700">
                Для переводов необходимо минимум 2 карты. У вас сейчас {cards.length} карта.
              </p>
            </CardContent>
          </Card>
        </div>
    )
  }

  return (
      <div className="max-w-md mx-auto">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArrowRightLeft className="h-5 w-5 text-blue-600" />
              <span>Перевод между картами</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="text-sm font-medium">С карты</label>
                <Select value={fromCardId} onValueChange={setFromCardId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите карту отправителя" />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((card) => (
                        <SelectItem key={card.id} value={card.id.toString()}>
                          {card.maskedCardNumber} (${card.balance.toFixed(2)})
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">На карту</label>
                <Select value={toCardId} onValueChange={setToCardId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите карту получателя" />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((card) => (
                        <SelectItem key={card.id} value={card.id.toString()}>
                          {card.maskedCardNumber} (${card.balance.toFixed(2)})
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Сумма</label>
                <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Введите сумму"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Обработка..." : "Перевести"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  )
}
