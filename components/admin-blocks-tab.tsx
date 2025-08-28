"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { api, type CardBlockResponse, type PageResponse } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Shield, CheckCircle, XCircle, Trash2 } from "lucide-react"

export function AdminBlocksTab() {
  const [blocks, setBlocks] = useState<PageResponse<CardBlockResponse> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [selectedBlock, setSelectedBlock] = useState<CardBlockResponse | null>(null)
  const [comment, setComment] = useState("")
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject">("approve")
  const { toast } = useToast()

  const loadBlocks = async () => {
    try {
      setLoading(true)
      const response = await api.getAllCardBlocks(page, 10)
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

  const handleAction = async (block: CardBlockResponse, type: "approve" | "reject") => {
    setSelectedBlock(block)
    setActionType(type)
    setComment("")
    setActionDialogOpen(true)
  }

  const handleSubmitAction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBlock || !comment.trim()) return

    try {
      if (actionType === "approve") {
        await api.approveCardBlock(selectedBlock.id, comment)
      } else {
        await api.rejectCardBlock(selectedBlock.id, comment)
      }
      toast({
        title: "Успешно",
        description: `Запрос на блокировку ${actionType === "approve" ? "одобрен" : "отклонен"} успешно`,
      })
      setActionDialogOpen(false)
      loadBlocks()
    } catch (error) {
      toast({
        title: "Ошибка",
        description: `Не удалось ${actionType === "approve" ? "одобрить" : "отклонить"} запрос на блокировку`,
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот запрос на блокировку?")) return

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
        <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
          <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          <span className="leading-tight">Управление запросами на блокировку</span>
        </h2>

        {blocks && blocks.content.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="text-center py-8 sm:py-12 px-4">
                <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Нет запросов на блокировку</h3>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                  В данный момент нет запросов на блокировку карт для рассмотрения.
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
                      <CardDescription className="text-xs sm:text-sm leading-tight">
                        ID карты: {block.cardId} | ID пользователя: {block.userId}
                        <br />
                        {new Date(block.requestDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 sm:space-y-4">
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
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-3 sm:mt-4">
                              <Button
                                  onClick={() => handleAction(block, "approve")}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 border-green-300 text-green-700 hover:bg-green-50 text-xs sm:text-sm"
                              >
                                <CheckCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                Одобрить
                              </Button>
                              <Button
                                  onClick={() => handleAction(block, "reject")}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 border-red-300 text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                              >
                                <XCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                Отклонить
                              </Button>
                            </div>
                        )}

                        <Button
                            onClick={() => handleDelete(block.id)}
                            variant="outline"
                            size="sm"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
                        >
                          <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Удалить
                        </Button>
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

        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogContent className="mx-4 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">
                {actionType === "approve" ? "Одобрить" : "Отклонить"} запрос на блокировку
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitAction} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Комментарий администратора</label>
                <Textarea
                    placeholder="Введите ваш комментарий..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={3}
                    className="text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActionDialogOpen(false)}
                    className="flex-1 text-sm sm:text-base"
                >
                  Отмена
                </Button>
                <Button
                    type="submit"
                    className={`flex-1 text-sm sm:text-base ${
                        actionType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                  {actionType === "approve" ? "Одобрить" : "Отклонить"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  )
}
