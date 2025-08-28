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
        description: "Не удалось загрузить запросы на блокировку"
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
    return <div className="text-center py-8 text-sm sm:text-base">Загрузка запросов на блокировку...</div>
  }

  return (
      <div className="space-y-4 sm:space-y-6">
        {blocks && blocks.content.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="text-center py-8 sm:py-12 px-4">
                <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Нет запросов на блокировку</h3>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                  Вы еще не создавали запросов на блокировку карт. Вы можете запросить блокировку карты на вкладке "Карты".
                </p>
              </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {blocks?.content.map((block) => (
                  <Card key={block.id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="text-base sm:text-lg flex items-start space-x-2">
                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">Запрос на блокировку #{block.id}</span>
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        ID карты: {block.cardId} | {new Date(block.requestDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">Статус:</span>
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
                            <div className="mt-2 sm:mt-3">
                              <span className="text-xs sm:text-sm font-medium">Комментарий администратора:</span>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded leading-relaxed">
                                {block.adminComment}
                              </p>
                            </div>
                        )}
                        {block.status === "PENDING" && (
                            <Button
                                onClick={() => handleDelete(block.id)}
                                variant="outline"
                                size="sm"
                                className="w-full mt-3 sm:mt-4 border-red-300 text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                            >
                              <AlertCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
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
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Button onClick={() => setPage(page - 1)} disabled={page === 0} variant="outline" size="sm">
                Предыдущая
              </Button>
              <span className="py-2 px-4 text-sm sm:text-base">
            Страница {page + 1} из {blocks.totalPages}
          </span>
              <Button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= blocks.totalPages - 1}
                  variant="outline"
                  size="sm"
              >
                Следующая
              </Button>
            </div>
        )}
      </div>
  )
}
