import React, { createContext, useContext, useState, useEffect } from 'react'
import { Note } from '../types'
import { useAuth } from './AuthContext'

interface NotesContextType {
  notes: Note[]
  fetchNotes: () => Promise<void>
  addNote: (
    note: Omit<Note, 'id' | 'created_at' | 'updated_at'>,
  ) => Promise<void>
  updateNote: (id: number, note: Partial<Note>) => Promise<void>
  deleteNote: (id: number) => Promise<void>
  loading: boolean
  hasError: boolean
  errorMessage: string
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { auth } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const storedNotes = localStorage.getItem('notes')
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes))
    }
  }, [])

  const resetError = () => {
    setHasError(false)
    setErrorMessage('')
  }

  const fetchNotes = async () => {
    try {
      resetError()
      setLoading(true)
      const response = await fetch('/api/notes', {
        headers: { Authorization: `Bearer ${auth?.auth.token}` },
      })

      if (!response.ok) {
        setHasError(true)
        setErrorMessage('Failed to fetch notes. Please try again.')
      }

      const notesData = await response.json()
      setNotes(notesData)
      localStorage.setItem('notes', JSON.stringify(notesData))      
    } catch (error) {
      console.error('Fetch notes error:', error)
      setHasError(true)
      setErrorMessage('Failed to fetch notes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addNote = async (
    noteData: Omit<Note, 'id' | 'created_at' | 'updated_at'>,
  ) => {
    try {
      resetError()
      setLoading(true)
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.auth.token}`,
        },
        body: JSON.stringify(noteData),
      })

      if (!response.ok) {
        setHasError(true)
        setErrorMessage('Failed to add note. Please try again.')
        return
      }

      const newNote = await response.json()
      setNotes((prev) => [...prev, newNote])      
    } catch (error) {
      console.error('Add note error:', error)
      setHasError(true)
      setErrorMessage('Failed to add note. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateNote = async (id: number, noteData: Partial<Note>) => {
    resetError()
    setLoading(true)
    try {      
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.auth.token}`,
        },
        body: JSON.stringify(noteData),
      })

      if (!response.ok) {
        setHasError(true)
        if (response.status === 409) {
          setErrorMessage('Conflict when updating the note. It is possible that it is blocked or a deadlock was generated. Please try again.')
          return
        }
        setErrorMessage('Failed to update note. Please try again.')
        return
      }

      const updatedNote = await response.json()
      setNotes((prev) =>
        prev.map((note) => (note.id === Number(id) ? updatedNote : note)),
      )
    } catch (error) {
      console.error('Update note error:', error)
      setErrorMessage('Failed to update note. Please try again.')
      setHasError(true)
    } finally {
      setLoading(false)
    }
  }

  const deleteNote = async (id: number) => {
    resetError()
    setLoading(true)
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth?.auth.token}` },
      })

      if (!response.ok) {
        setHasError(true)
        setErrorMessage('Failed to delete note. Please try again.')
        return
      }

      setNotes((prev) => prev.filter((note) => note.id !== Number(id)))
    } catch (error) {
      console.error('Delete note error:', error)
      setHasError(true)
      setErrorMessage('Failed to delete note. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <NotesContext.Provider
      value={{ notes, fetchNotes, addNote, updateNote, deleteNote, loading, hasError, errorMessage }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export const useNotes = () => {
  const context = useContext(NotesContext)
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider')
  }
  return context
}
