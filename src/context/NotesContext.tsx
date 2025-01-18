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
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { auth } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    const storedNotes = localStorage.getItem('notes')
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes))
    }
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes', {
        headers: { Authorization: `Bearer ${auth?.auth.token}` },
      })

      if (!response.ok) throw new Error('Failed to fetch notes')

      const notesData = await response.json()
      setNotes(notesData)
      localStorage.setItem('notes', JSON.stringify(notesData))
    } catch (error) {
      console.error('Fetch notes error:', error)
      throw error
    }
  }

  const addNote = async (
    noteData: Omit<Note, 'id' | 'created_at' | 'updated_at'>,
  ) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.auth.token}`,
        },
        body: JSON.stringify(noteData),
      })

      if (!response.ok) throw new Error('Failed to add note')

      const newNote = await response.json()
      setNotes((prev) => [...prev, newNote])
    } catch (error) {
      console.error('Add note error:', error)
      throw error
    }
  }

  const updateNote = async (id: number, noteData: Partial<Note>) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.auth.token}`,
        },
        body: JSON.stringify(noteData),
      })

      if (!response.ok) throw new Error('Failed to update note')

      const updatedNote = await response.json()
      setNotes((prev) =>
        prev.map((note) => (note.id === Number(id) ? updatedNote : note)),
      )
    } catch (error) {
      console.error('Update note error:', error)
      throw error
    }
  }

  const deleteNote = async (id: number) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth?.auth.token}` },
      })

      if (!response.ok) throw new Error('Failed to delete note')

      setNotes((prev) => prev.filter((note) => note.id !== Number(id)))
    } catch (error) {
      console.error('Delete note error:', error)
      throw error
    }
  }

  return (
    <NotesContext.Provider
      value={{ notes, fetchNotes, addNote, updateNote, deleteNote }}
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
