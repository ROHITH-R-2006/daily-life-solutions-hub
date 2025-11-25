"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, CheckCircle2, Circle, ExternalLink, Bookmark } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Task {
  id: string
  text: string
  completed: boolean
  priority: "high" | "medium" | "low"
}

interface Note {
  id: string
  content: string
  timestamp: Date
}

interface Habit {
  id: string
  name: string
  streak: number
  checkedToday: boolean
}

interface Bookmark {
  id: string
  title: string
  url: string
  category: string
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">("medium")
  
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState("")
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [newBookmark, setNewBookmark] = useState({ title: "", url: "", category: "" })

  // Load from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    const savedNotes = localStorage.getItem("notes")
    const savedHabits = localStorage.getItem("habits")
    const savedBookmarks = localStorage.getItem("bookmarks")
    
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedNotes) setNotes(JSON.parse(savedNotes))
    if (savedHabits) setHabits(JSON.parse(savedHabits))
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits))
  }, [habits])

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])

  // Task Management
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        priority: taskPriority
      }])
      setNewTask("")
    }
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  // Notes
  const addNote = () => {
    if (newNote.trim()) {
      setNotes([{ id: Date.now().toString(), content: newNote, timestamp: new Date() }, ...notes])
      setNewNote("")
    }
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  // Habits
  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, {
        id: Date.now().toString(),
        name: newHabit,
        streak: 0,
        checkedToday: false
      }])
      setNewHabit("")
    }
  }

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newChecked = !habit.checkedToday
        return {
          ...habit,
          checkedToday: newChecked,
          streak: newChecked ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        }
      }
      return habit
    }))
  }

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id))
  }

  // Bookmarks
  const addBookmark = () => {
    if (newBookmark.title.trim() && newBookmark.url.trim()) {
      setBookmarks([...bookmarks, {
        id: Date.now().toString(),
        ...newBookmark
      }])
      setNewBookmark({ title: "", url: "", category: "" })
    }
  }

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id))
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
                {tasks.length === 0 ? (
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
                {notes.length === 0 ? (
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
                {habits.length === 0 ? (
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
                {bookmarks.length === 0 ? (
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
