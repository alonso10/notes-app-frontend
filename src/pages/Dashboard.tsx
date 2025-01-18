import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Grid2 as Grid,
  CardContent,
  CardActions,
  Button,
  Fab,
  Modal,
  Box,
  CardHeader,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useNotes } from '../context/NotesContext'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

function ModalConfirmDelete({
  open,
  handleClose,
  handleConfirm,
}: {
  open: boolean
  handleClose: () => void
  handleConfirm: () => void
}) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #ccc',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Are youy sure?
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Do you want to delete this note?
        </Typography>
        <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={() => handleClose()}
          >
            Close
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              handleConfirm()
              handleClose()
            }}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </Grid>
      </Box>
    </Modal>
  )
}

export default function Dashboard() {
  const { notes, fetchNotes, deleteNote } = useNotes()
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [openModalDeletem, setOpenModalDelete] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null)

  useEffect(() => {
    if (!auth) {
      navigate('/login')
    }

    fetchNotes()
  }, [auth, navigate])

  const handleEdit = (id: number) => {
    navigate(`/note/${id}`)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id)
    } catch (error) {
      console.error('Error deleting note:', error)
    }
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
    </MainLayout>
  )
}
