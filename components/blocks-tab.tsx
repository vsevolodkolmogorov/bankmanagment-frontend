"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api, type CardBlockResponse, type PageResponse } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Shield, AlertCircle } from "lucide-react"

export function BlocksTab() {
  const [blocks, setBlocks] = useState<PageResponse<CardBlockResponse> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const { toast } = useToast()

  const loadBlocks = async () => {
    try {
      setLoading(true)
      const response = await api.getUserCardBlocks(page, 10)
      setBlocks(response)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить запросы на блокировку",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBlocks()
  }, [page])

  const handleDelete = async (id: number) => {
    try {
      await api.deleteCardBlock(id)
      toast({
        title: "Успешно",
        description: "Запрос на блокировку удален успешно",
      })
      loadBlocks()
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить запрос на блокировку",
      })
    }
  }

  if (loading && !blocks) {
    return <div className="text-center py-8">Загрузка запросов на блокировку...</div>
  }

  return (
      <div className="space-y-6">
        {blocks && blocks.content.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="text-center py-12">
                <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет запросов на блокировку</h3>
                <p className="text-gray-500">
                  Вы еще не создавали запросов на блокировку карт. Вы можете запросить блокировку карты на вкладке "Карты".
                </p>
              </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blocks?.content.map((block) => (
                  <Card key={block.id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span>Запрос на блокировку #{block.id}</span>
                      </CardTitle>
                      <CardDescription>
                        ID карты: {block.cardId} | {new Date(block.requestDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Статус:</span>
                          <span
                              className={`font-medium px-2 py-1 rounded-full text-xs ${
                                  block.status === "APPROVED"
                                      ? "bg-green-100 text-green-700"
                                      : block.status === "REJECTED"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                      {block.status === "APPROVED"
                          ? "Одобрен"
                          : block.status === "REJECTED"
                              ? "Отклонен"
                              : "В ожидании"}
                    </span>
                        </div>
                        {block.adminComment && (
                            <div className="mt-2">
                              <span className="text-sm font-medium">Комментарий администратора:</span>
                              <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">{block.adminComment}</p>
                            </div>
                        )}
                        {block.status === "PENDING" && (
                            <Button
                                onClick={() => handleDelete(block.id)}
                                variant="outline"
                                size="sm"
                                className="w-full mt-4 border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Отменить запрос
                            </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
        )}

        {blocks && blocks.totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button onClick={() => setPage(page - 1)} disabled={page === 0} variant="outline">
                Предыдущая
              </Button>
              <span className="py-2 px-4">
            Страница {page + 1} из {blocks.totalPages}
          </span>
              <Button onClick={() => setPage(page + 1)} disabled={page >= blocks.totalPages - 1} variant="outline">
                Следующая
              </Button>
            </div>
        )}
      </div>
  )
}
