"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, CheckCircle2, Circle, ExternalLink, Bookmark } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Task {
  id: number
  text: string
  completed: boolean
  priority: "high" | "medium" | "low"
  createdAt: string
}

interface Note {
  id: number
  content: string
  timestamp: string
  createdAt: string
}

interface Habit {
  id: number
  name: string
  streak: number
  checkedToday: boolean
  createdAt: string
}

interface Bookmark {
  id: number
  title: string
  url: string
  category: string
  createdAt: string
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">("medium")
  const [tasksLoading, setTasksLoading] = useState(true)
  
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [notesLoading, setNotesLoading] = useState(true)
  
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState("")
  const [habitsLoading, setHabitsLoading] = useState(true)
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [newBookmark, setNewBookmark] = useState({ title: "", url: "", category: "" })
  const [bookmarksLoading, setBookmarksLoading] = useState(true)

  // Fetch data from API
  useEffect(() => {
    fetchTasks()
    fetchNotes()
    fetchHabits()
    fetchBookmarks()
  }, [])

  const fetchTasks = async () => {
    try {
      setTasksLoading(true)
      const response = await fetch("/api/tasks?limit=100")
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      toast.error("Failed to load tasks")
    } finally {
      setTasksLoading(false)
    }
  }

  const fetchNotes = async () => {
    try {
      setNotesLoading(true)
      const response = await fetch("/api/dashboard-notes?limit=100")
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      toast.error("Failed to load notes")
    } finally {
      setNotesLoading(false)
    }
  }

  const fetchHabits = async () => {
    try {
      setHabitsLoading(true)
      const response = await fetch("/api/habits?limit=100")
      if (response.ok) {
        const data = await response.json()
        setHabits(data)
      }
    } catch (error) {
      toast.error("Failed to load habits")
    } finally {
      setHabitsLoading(false)
    }
  }

  const fetchBookmarks = async () => {
    try {
      setBookmarksLoading(true)
      const response = await fetch("/api/bookmarks?limit=100")
      if (response.ok) {
        const data = await response.json()
        setBookmarks(data)
      }
    } catch (error) {
      toast.error("Failed to load bookmarks")
    } finally {
      setBookmarksLoading(false)
    }
  }

  // Task Management
  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: newTask,
            completed: false,
            priority: taskPriority
          })
        })
        if (response.ok) {
          const task = await response.json()
          setTasks([task, ...tasks])
          setNewTask("")
          toast.success("Task added")
        } else {
          toast.error("Failed to add task")
        }
      } catch (error) {
        toast.error("Failed to add task")
      }
    }
  }

  const toggleTask = async (id: number) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed })
      })
      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(tasks.map(t => t.id === id ? updatedTask : t))
      } else {
        toast.error("Failed to update task")
      }
    } catch (error) {
      toast.error("Failed to update task")
    }
  }

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== id))
        toast.success("Task deleted")
      } else {
        toast.error("Failed to delete task")
      }
    } catch (error) {
      toast.error("Failed to delete task")
    }
  }

  // Notes
  const addNote = async () => {
    if (newNote.trim()) {
      try {
        const response = await fetch("/api/dashboard-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newNote })
        })
        if (response.ok) {
          const note = await response.json()
          setNotes([note, ...notes])
          setNewNote("")
          toast.success("Note added")
        } else {
          toast.error("Failed to add note")
        }
      } catch (error) {
        toast.error("Failed to add note")
      }
    }
  }

  const deleteNote = async (id: number) => {
    try {
      const response = await fetch(`/api/dashboard-notes?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        setNotes(notes.filter(note => note.id !== id))
        toast.success("Note deleted")
      } else {
        toast.error("Failed to delete note")
      }
    } catch (error) {
      toast.error("Failed to delete note")
    }
  }

  // Habits
  const addHabit = async () => {
    if (newHabit.trim()) {
      try {
        const response = await fetch("/api/habits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newHabit })
        })
        if (response.ok) {
          const habit = await response.json()
          setHabits([...habits, habit])
          setNewHabit("")
          toast.success("Habit added")
        } else {
          toast.error("Failed to add habit")
        }
      } catch (error) {
        toast.error("Failed to add habit")
      }
    }
  }

  const toggleHabit = async (id: number) => {
    try {
      const response = await fetch(`/api/habits/toggle?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      })
      if (response.ok) {
        const updatedHabit = await response.json()
        setHabits(habits.map(h => h.id === id ? updatedHabit : h))
      } else {
        toast.error("Failed to update habit")
      }
    } catch (error) {
      toast.error("Failed to update habit")
    }
  }

  const deleteHabit = async (id: number) => {
    try {
      const response = await fetch(`/api/habits?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        setHabits(habits.filter(habit => habit.id !== id))
        toast.success("Habit deleted")
      } else {
        toast.error("Failed to delete habit")
      }
    } catch (error) {
      toast.error("Failed to delete habit")
    }
  }

  // Bookmarks
  const addBookmark = async () => {
    if (newBookmark.title.trim() && newBookmark.url.trim()) {
      try {
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBookmark)
        })
        if (response.ok) {
          const bookmark = await response.json()
          setBookmarks([bookmark, ...bookmarks])
          setNewBookmark({ title: "", url: "", category: "" })
          toast.success("Bookmark added")
        } else {
          toast.error("Failed to add bookmark")
        }
      } catch (error) {
        toast.error("Failed to add bookmark")
      }
    }
  }

  const deleteBookmark = async (id: number) => {
    try {
      const response = await fetch(`/api/bookmarks?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id))
        toast.success("Bookmark deleted")
      } else {
        toast.error("Failed to delete bookmark")
      }
    } catch (error) {
      toast.error("Failed to delete bookmark")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive"
      case "medium": return "default"
      case "low": return "secondary"
      default: return "default"
    }
  }

  return (
    <div className="flex-1 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Your unified personal management hub</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Manager */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Task Manager
              </CardTitle>
              <CardDescription>Organize and track your daily tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTask()}
                />
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <Button onClick={addTask} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {tasksLoading ? (
                  <p className="text-muted-foreground text-center py-8">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No tasks yet. Add one to get started!</p>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                      <button onClick={() => toggleTask(task.id)}>
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                      <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.text}
                      </span>
                      <Badge variant={getPriorityColor(task.priority) as any}>
                        {task.priority}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📝 Quick Notes
              </CardTitle>
              <CardDescription>Capture your thoughts instantly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Write a quick note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={2}
                />
                <Button onClick={addNote} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {notesLoading ? (
                  <p className="text-muted-foreground text-center py-8">Loading notes...</p>
                ) : notes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No notes yet. Start writing!</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="p-3 bg-background rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.timestamp).toLocaleString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Habit Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Habit Tracker
              </CardTitle>
              <CardDescription>Build and maintain positive habits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new habit..."
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addHabit()}
                />
                <Button onClick={addHabit} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {habitsLoading ? (
                  <p className="text-muted-foreground text-center py-8">Loading habits...</p>
                ) : habits.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No habits yet. Add one to start tracking!</p>
                ) : (
                  habits.map((habit) => (
                    <div key={habit.id} className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                      <Checkbox
                        checked={habit.checkedToday}
                        onCheckedChange={() => toggleHabit(habit.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{habit.name}</p>
                        <p className="text-sm text-muted-foreground">
                          🔥 {habit.streak} day streak
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteHabit(habit.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resource Bookmarks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="w-5 h-5" />
                Resource Bookmarks
              </CardTitle>
              <CardDescription>Save important links and resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Title"
                  value={newBookmark.title}
                  onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="URL"
                    value={newBookmark.url}
                    onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
                  />
                  <Input
                    placeholder="Category"
                    value={newBookmark.category}
                    onChange={(e) => setNewBookmark({...newBookmark, category: e.target.value})}
                    className="w-32"
                  />
                  <Button onClick={addBookmark} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {bookmarksLoading ? (
                  <p className="text-muted-foreground text-center py-8">Loading bookmarks...</p>
                ) : bookmarks.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No bookmarks yet. Add your favorite resources!</p>
                ) : (
                  bookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="flex items-start gap-2 p-3 bg-background rounded-lg border">
                      <ExternalLink className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline block truncate"
                        >
                          {bookmark.title}
                        </a>
                        <p className="text-sm text-muted-foreground truncate">{bookmark.url}</p>
                        {bookmark.category && (
                          <Badge variant="secondary" className="mt-1">
                            {bookmark.category}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={() => deleteBookmark(bookmark.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}