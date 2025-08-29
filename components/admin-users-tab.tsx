"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { api, type UserResponse, type PageResponse } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Users, UserPlus, Trash2 } from "lucide-react"

export function AdminUsersTab() {
  const [users, setUsers] = useState<PageResponse<UserResponse> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "USER" })
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await api.getUsers(page, 10)
      setUsers(response)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось загрузить пользователей";

      toast({
        title: "Ошибка",
        description: message
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [page])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.createUser(newUser)
      toast({
        title: "Успешно",
        description: "Пользователь создан успешно",
      })
      setNewUser({ email: "", password: "", role: "USER" })
      setCreateDialogOpen(false)
      loadUsers()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось создать пользователя";

      toast({
        title: "Ошибка",
        description: message
      })
    }
  }

  const handleToggleLock = async (id: number) => {
    try {
      await api.toggleUserLock(id)
      toast({
        title: "Успешно",
        description: "Статус блокировки пользователя обновлен",
      })
      loadUsers()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось обновить пользователя";

      toast({
        title: "Ошибка",
        description: message
      })
    }
  }

  const handleToggleEnable = async (id: number) => {
    try {
      await api.toggleUserEnable(id)
      toast({
        title: "Успешно",
        description: "Статус активности пользователя обновлен",
      })
      loadUsers()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось обновить пользователя";

      toast({
        title: "Ошибка",
        description: message
      })
    }
  }

  const handleUpdateRole = async (id: number, role: string) => {
    try {
      await api.updateUserRole(id, role)
      toast({
        title: "Успешно",
        description: "Роль пользователя обновлена",
      })
      loadUsers()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось обновить роль";

      toast({
        title: "Ошибка",
        description: message
      })
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) return

    try {
      await api.deleteUser(id)
      toast({
        title: "Успешно",
        description: "Пользователь удален успешно",
      })
      loadUsers()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось удалить пользователя";

      toast({
        title: "Ошибка",
        description: message
      })
    }
  }

  if (loading && !users) {
    return <div className="text-center py-8 text-sm sm:text-base">Загрузка пользователей...</div>
  }

  return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <span>Управление пользователями</span>
          </h2>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base">
                <UserPlus className="mr-2 h-4 w-4" />
                Создать пользователя
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">Создать нового пользователя</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <Input
                    type="email"
                    placeholder="Электронная почта"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                    className="text-sm sm:text-base"
                />
                <Input
                    type="password"
                    placeholder="Пароль"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                    className="text-sm sm:text-base"
                />
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Пользователь</SelectItem>
                    <SelectItem value="ADMIN">Администратор</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base">
                  Создать пользователя
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {users && users.content.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="text-center py-8 sm:py-12 px-4">
                <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Пользователи не найдены</h3>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                  В системе пока нет пользователей. Создайте первого пользователя для начала работы.
                </p>
              </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {users?.content.map((user) => (
                  <Card key={user.id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="text-base sm:text-lg truncate">{user.email}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">ID: {user.id}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <span className="text-sm sm:text-base">Роль:</span>
                          <Select value={user.roleName} onValueChange={(value) => handleUpdateRole(user.id, value)}>
                            <SelectTrigger className="w-full sm:w-32 text-xs sm:text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USER">Пользователь</SelectItem>
                              <SelectItem value="ADMIN">Администратор</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">Статус:</span>
                          <span
                              className={`font-medium px-2 py-1 rounded-full text-xs ${
                                  user.isEnabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                          >
                      {user.isEnabled ? "Активен" : "Отключен"}
                    </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">Блокировка:</span>
                          <span
                              className={`font-medium px-2 py-1 rounded-full text-xs ${
                                  user.isNonLocked ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                          >
                      {user.isNonLocked ? "Разблокирован" : "Заблокирован"}
                    </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">Карты:</span>
                          <span className="text-sm sm:text-base">{user.cards?.length || 0}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                          <Button
                              onClick={() => handleToggleEnable(user.id)}
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs sm:text-sm"
                          >
                            {user.isEnabled ? "Отключить" : "Включить"}
                          </Button>
                          <Button
                              onClick={() => handleToggleLock(user.id)}
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs sm:text-sm"
                          >
                            {user.isNonLocked ? "Заблокировать" : "Разблокировать"}
                          </Button>
                        </div>

                        <Button
                            onClick={() => handleDeleteUser(user.id)}
                            variant="outline"
                            size="sm"
                            className="w-full border-red-300 text-red-700 hover:bg-red-50 text-xs sm:text-sm"
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

        {users && users.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Button onClick={() => setPage(page - 1)} disabled={page === 0} variant="outline" size="sm">
                Предыдущая
              </Button>
              <span className="py-2 px-4 text-sm sm:text-base">
            Страница {page + 1} из {users.totalPages}
          </span>
              <Button onClick={() => setPage(page + 1)} disabled={page >= users.totalPages - 1} variant="outline" size="sm">
                Следующая
              </Button>
            </div>
        )}
      </div>
  )
}
