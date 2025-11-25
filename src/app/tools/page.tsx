"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator as CalcIcon, Timer, ArrowRightLeft, FileText, FolderOpen, Play, Pause, RotateCcw, Save, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface SavedNote {
  id: number
  title: string
  content: string
  timestamp: string
  createdAt: string
}

interface SavedFile {
  id: number
  name: string
  category: string
  size: string
  timestamp: string
  createdAt: string
}

export default function ToolsPage() {
  // Calculator State
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [newNumber, setNewNumber] = useState(true)

  // Timer State
  const [time, setTime] = useState(1500) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [timerMode, setTimerMode] = useState<"pomodoro" | "short" | "long">("pomodoro")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Converter State
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")
  const [fromUnit, setFromUnit] = useState("meters")
  const [toUnit, setToUnit] = useState("feet")
  const [converterType, setConverterType] = useState("length")

  // Note-taking State
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([])
  const [notesLoading, setNotesLoading] = useState(true)

  // File Organizer State
  const [fileName, setFileName] = useState("")
  const [fileCategory, setFileCategory] = useState("Documents")
  const [fileSize, setFileSize] = useState("")
  const [savedFiles, setSavedFiles] = useState<SavedFile[]>([])
  const [filesLoading, setFilesLoading] = useState(true)

  // Load saved data from API
  useEffect(() => {
    fetchNotes()
    fetchFiles()
  }, [])

  const fetchNotes = async () => {
    try {
      setNotesLoading(true)
      const response = await fetch("/api/tool-notes?limit=100")
      if (response.ok) {
        const data = await response.json()
        setSavedNotes(data)
      }
    } catch (error) {
      toast.error("Failed to load notes")
    } finally {
      setNotesLoading(false)
    }
  }

  const fetchFiles = async () => {
    try {
      setFilesLoading(true)
      const response = await fetch("/api/tool-files?limit=100")
      if (response.ok) {
        const data = await response.json()
        setSavedFiles(data)
      }
    } catch (error) {
      toast.error("Failed to load files")
    } finally {
      setFilesLoading(false)
    }
  }

  // Calculator Functions
  const handleNumberClick = (num: string) => {
    if (newNumber) {
      setDisplay(num)
      setNewNumber(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const handleOperationClick = (op: string) => {
    const current = parseFloat(display)
    if (previousValue !== null && !newNumber) {
      calculate()
    } else {
      setPreviousValue(current)
    }
    setOperation(op)
    setNewNumber(true)
  }

  const calculate = () => {
    if (previousValue === null || operation === null) return
    
    const current = parseFloat(display)
    let result = 0

    switch (operation) {
      case "+": result = previousValue + current; break
      case "-": result = previousValue - current; break
      case "*": result = previousValue * current; break
      case "/": result = previousValue / current; break
    }

    setDisplay(result.toString())
    setPreviousValue(null)
    setOperation(null)
    setNewNumber(true)
  }

  const clearCalculator = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setNewNumber(true)
  }

  // Timer Functions
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const resetTimer = () => {
    setIsRunning(false)
    switch (timerMode) {
      case "pomodoro": setTime(1500); break // 25 min
      case "short": setTime(300); break // 5 min
      case "long": setTime(900); break // 15 min
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Converter Functions
  const conversionRates: Record<string, Record<string, number>> = {
    length: {
      meters: 1,
      feet: 3.28084,
      inches: 39.3701,
      kilometers: 0.001,
      miles: 0.000621371,
    },
    weight: {
      kilograms: 1,
      pounds: 2.20462,
      ounces: 35.274,
      grams: 1000,
    },
    temperature: {
      celsius: 1,
      fahrenheit: 1,
      kelvin: 1,
    }
  }

  const convertValue = (value: string, from: string, to: string, type: string) => {
    const val = parseFloat(value)
    if (isNaN(val)) return ""

    if (type === "temperature") {
      let celsius = val
      if (from === "fahrenheit") celsius = (val - 32) * 5/9
      if (from === "kelvin") celsius = val - 273.15

      if (to === "celsius") return celsius.toFixed(2)
      if (to === "fahrenheit") return ((celsius * 9/5) + 32).toFixed(2)
      if (to === "kelvin") return (celsius + 273.15).toFixed(2)
    }

    const rates = conversionRates[type]
    const baseValue = val / rates[from]
    return (baseValue * rates[to]).toFixed(4)
  }

  useEffect(() => {
    if (fromValue) {
      setToValue(convertValue(fromValue, fromUnit, toUnit, converterType))
    }
  }, [fromValue, fromUnit, toUnit, converterType])

  // Note Functions
  const saveNote = async () => {
    if (noteTitle.trim() && noteContent.trim()) {
      try {
        const response = await fetch("/api/tool-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: noteTitle,
            content: noteContent
          })
        })
        if (response.ok) {
          const newNote = await response.json()
          setSavedNotes([newNote, ...savedNotes])
          setNoteTitle("")
          setNoteContent("")
          toast.success("Note saved")
        } else {
          toast.error("Failed to save note")
        }
      } catch (error) {
        toast.error("Failed to save note")
      }
    }
  }

  const deleteNote = async (id: number) => {
    try {
      const response = await fetch(`/api/tool-notes?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        setSavedNotes(savedNotes.filter(note => note.id !== id))
        toast.success("Note deleted")
      } else {
        toast.error("Failed to delete note")
      }
    } catch (error) {
      toast.error("Failed to delete note")
    }
  }

  // File Functions
  const saveFile = async () => {
    if (fileName.trim()) {
      try {
        const response = await fetch("/api/tool-files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fileName,
            category: fileCategory,
            size: fileSize || "N/A"
          })
        })
        if (response.ok) {
          const newFile = await response.json()
          setSavedFiles([newFile, ...savedFiles])
          setFileName("")
          setFileSize("")
          toast.success("File saved")
        } else {
          toast.error("Failed to save file")
        }
      } catch (error) {
        toast.error("Failed to save file")
      }
    }
  }

  const deleteFile = async (id: number) => {
    try {
      const response = await fetch(`/api/tool-files?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        setSavedFiles(savedFiles.filter(file => file.id !== id))
        toast.success("File deleted")
      } else {
        toast.error("Failed to delete file")
      }
    } catch (error) {
      toast.error("Failed to delete file")
    }
  }

  return (
    <div className="flex-1 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Productivity Tools</h1>
          <p className="text-muted-foreground">Essential utilities to boost your efficiency</p>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <CalcIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="hidden sm:inline">Timer</span>
            </TabsTrigger>
            <TabsTrigger value="converter" className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Converter</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Files</span>
            </TabsTrigger>
          </TabsList>

          {/* Calculator */}
          <TabsContent value="calculator">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Calculator</CardTitle>
                <CardDescription>Perform basic calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg text-right text-3xl font-mono min-h-[60px] flex items-center justify-end">
                    {display}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {["7", "8", "9", "/"].map((btn) => (
                      <Button
                        key={btn}
                        variant={["/", "*", "-", "+"].includes(btn) ? "secondary" : "outline"}
                        onClick={() => ["/", "*", "-", "+"].includes(btn) ? handleOperationClick(btn) : handleNumberClick(btn)}
                        className="h-14 text-lg"
                      >
                        {btn}
                      </Button>
                    ))}
                    {["4", "5", "6", "*"].map((btn) => (
                      <Button
                        key={btn}
                        variant={["/", "*", "-", "+"].includes(btn) ? "secondary" : "outline"}
                        onClick={() => ["/", "*", "-", "+"].includes(btn) ? handleOperationClick(btn) : handleNumberClick(btn)}
                        className="h-14 text-lg"
                      >
                        {btn}
                      </Button>
                    ))}
                    {["1", "2", "3", "-"].map((btn) => (
                      <Button
                        key={btn}
                        variant={["/", "*", "-", "+"].includes(btn) ? "secondary" : "outline"}
                        onClick={() => ["/", "*", "-", "+"].includes(btn) ? handleOperationClick(btn) : handleNumberClick(btn)}
                        className="h-14 text-lg"
                      >
                        {btn}
                      </Button>
                    ))}
                    <Button variant="outline" onClick={() => handleNumberClick("0")} className="h-14 text-lg">0</Button>
                    <Button variant="outline" onClick={() => handleNumberClick(".")} className="h-14 text-lg">.</Button>
                    <Button variant="default" onClick={calculate} className="h-14 text-lg">=</Button>
                    <Button variant="secondary" onClick={handleOperationClick} className="h-14 text-lg">+</Button>
                    <Button variant="destructive" onClick={clearCalculator} className="col-span-4 h-14 text-lg">Clear</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timer/Pomodoro */}
          <TabsContent value="timer">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Pomodoro Timer</CardTitle>
                <CardDescription>Focus on your work with timed sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant={timerMode === "pomodoro" ? "default" : "outline"}
                      onClick={() => { setTimerMode("pomodoro"); setTime(1500); setIsRunning(false); }}
                    >
                      Pomodoro (25m)
                    </Button>
                    <Button
                      variant={timerMode === "short" ? "default" : "outline"}
                      onClick={() => { setTimerMode("short"); setTime(300); setIsRunning(false); }}
                    >
                      Short (5m)
                    </Button>
                    <Button
                      variant={timerMode === "long" ? "default" : "outline"}
                      onClick={() => { setTimerMode("long"); setTime(900); setIsRunning(false); }}
                    >
                      Long (15m)
                    </Button>
                  </div>

                  <div className="bg-muted p-8 rounded-lg text-center">
                    <div className="text-7xl font-bold font-mono mb-4">
                      {formatTime(time)}
                    </div>
                    <div className="text-muted-foreground">
                      {isRunning ? "Focus time! 🎯" : "Ready to start?"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={() => setIsRunning(!isRunning)}
                    >
                      {isRunning ? (
                        <><Pause className="w-4 h-4 mr-2" /> Pause</>
                      ) : (
                        <><Play className="w-4 h-4 mr-2" /> Start</>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={resetTimer}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Unit Converter */}
          <TabsContent value="converter">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Unit Converter</CardTitle>
                <CardDescription>Convert between different units</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant={converterType === "length" ? "default" : "outline"}
                      onClick={() => { setConverterType("length"); setFromUnit("meters"); setToUnit("feet"); }}
                    >
                      Length
                    </Button>
                    <Button
                      variant={converterType === "weight" ? "default" : "outline"}
                      onClick={() => { setConverterType("weight"); setFromUnit("kilograms"); setToUnit("pounds"); }}
                    >
                      Weight
                    </Button>
                    <Button
                      variant={converterType === "temperature" ? "default" : "outline"}
                      onClick={() => { setConverterType("temperature"); setFromUnit("celsius"); setToUnit("fahrenheit"); }}
                    >
                      Temperature
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">From</label>
                      <Input
                        type="number"
                        placeholder="Enter value"
                        value={fromValue}
                        onChange={(e) => setFromValue(e.target.value)}
                      />
                      <select
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                      >
                        {Object.keys(conversionRates[converterType]).map((unit) => (
                          <option key={unit} value={unit}>
                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">To</label>
                      <Input
                        type="number"
                        placeholder="Result"
                        value={toValue}
                        readOnly
                        className="bg-muted"
                      />
                      <select
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                      >
                        {Object.keys(conversionRates[converterType]).map((unit) => (
                          <option key={unit} value={unit}>
                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Note-taking */}
          <TabsContent value="notes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>New Note</CardTitle>
                  <CardDescription>Write and save your notes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Note title..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Start writing..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={10}
                  />
                  <Button onClick={saveNote} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Note
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Saved Notes</CardTitle>
                  <CardDescription>Your stored notes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {notesLoading ? (
                      <p className="text-muted-foreground text-center py-8">Loading notes...</p>
                    ) : savedNotes.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No saved notes yet</p>
                    ) : (
                      savedNotes.map((note) => (
                        <div key={note.id} className="p-4 bg-muted rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{note.title}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => deleteNote(note.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                            {note.content}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(note.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* File Organizer */}
          <TabsContent value="files">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add File Reference</CardTitle>
                  <CardDescription>Organize your file information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="File name..."
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                  <select
                    value={fileCategory}
                    onChange={(e) => setFileCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="Documents">Documents</option>
                    <option value="Images">Images</option>
                    <option value="Videos">Videos</option>
                    <option value="Audio">Audio</option>
                    <option value="Other">Other</option>
                  </select>
                  <Input
                    placeholder="File size (optional)..."
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                  />
                  <Button onClick={saveFile} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save File Reference
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>File References</CardTitle>
                  <CardDescription>Your organized files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {filesLoading ? (
                      <p className="text-muted-foreground text-center py-8">Loading files...</p>
                    ) : savedFiles.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No file references yet</p>
                    ) : (
                      savedFiles.map((file) => (
                        <div key={file.id} className="p-4 bg-muted rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">{file.name}</h3>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="secondary">{file.category}</Badge>
                                {file.size !== "N/A" && (
                                  <Badge variant="outline">{file.size}</Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 flex-shrink-0"
                              onClick={() => deleteFile(file.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(file.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}