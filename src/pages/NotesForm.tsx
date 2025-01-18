import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, TextField, Button, Typography, Paper } from '@mui/material'
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material'
import { useNotes } from '../context/NotesContext'
import MainLayout from '../layouts/MainLayout'

export default function NoteForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { notes, addNote, updateNote } = useNotes()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (id && id !== 'new') {
      const note = notes.find((n) => n.id === Number(id))
      if (note) {
        setTitle(note.title)
        setContent(note.content)
      }
    }
  }, [id, notes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (id === 'new') {
        await addNote({ title, content })
      } else {
        await updateNote(Number(id), { title, content })
      }
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  return (
    <MainLayout>
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {id === 'new' ? 'Create Note' : 'Edit Note'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="content"
              label="Content"
              id="content"
              multiline
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  )
}
