import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Grid2 as Grid,
  CardContent,
  CardActions,
  Fab,
  Box,
  CardHeader,
  Avatar,
  IconButton,
  Divider,
  Snackbar,
  Slide,
  SlideProps,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { useNotes } from '../context/NotesContext'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import { ModalConfirmDelete } from '../components/modal/ConfirmDeleteNote'

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

export default function Dashboard() {
  const { notes, fetchNotes, deleteNote, hasError, errorMessage, loading, success, successMessage } = useNotes()
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [openModalDeletem, setOpenModalDelete] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null)
  const [openNotification, setOpenNotification] = useState(false)

  useEffect(() => {
    if (!auth) {
      navigate('/login')
    }

    fetchNotes()
  }, [auth, navigate])

  useEffect(() => {
    setOpenNotification(hasError || success)
  }, [hasError, success])

  const handleEdit = (id: number) => {
    navigate(`/note/${id}`)
  }

  const handleDelete = async (id: number) => {
    await deleteNote(id)
  }

  return (
    <MainLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        My Notes
      </Typography>

      <Grid container spacing={4}>
        {notes.map((note, index) => (
          <div
            key={note.id}
            style={{
              transform: index % 2 === 0 ? 'rotate(-6deg)' : 'rotate(4deg)',
            }}
            className="custom-card"
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: '#517ad5' }}>
                  {note.title.charAt(0)}
                </Avatar>
              }
              title={note.title}
              subheader={`Created: ${new Date(note.created_at).toLocaleDateString()}`}
            />
            <Divider />
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {note.content}
              </Typography>
            </CardContent>
            <Divider />
            <CardActions>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Typography variant="caption" color="textSecondary">
                  {`Updated: ${new Date(note.updated_at).toLocaleDateString()}`}
                </Typography>
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(note.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setOpenModalDelete(true)
                      setNoteToDelete(note.id)
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardActions>
          </div>
        ))}
      </Grid>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/note/new')}
      >
        <AddIcon />
      </Fab>
      <ModalConfirmDelete
        open={openModalDeletem}
        handleClose={() => {
          setOpenModalDelete(false)
          setNoteToDelete(null)
        }}
        handleConfirm={() => {
          handleDelete(Number(noteToDelete))
          setNoteToDelete(null)
        }}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openNotification}
        autoHideDuration={2000}
        TransitionComponent={SlideTransition}
        onClose={() => setOpenNotification(false)}
      >
        <Alert          
          severity={hasError ? 'error' : 'success'}
          sx={{ width: '100%' }}
          onClose={() => setOpenNotification(false)}
        >
          {hasError ? errorMessage : successMessage}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </MainLayout>
  )
}
