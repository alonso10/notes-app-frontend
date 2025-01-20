import { Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material'

export function ModalConfirmDelete({
  open,
  handleClose,
  handleConfirm,
}: {
  open: boolean
  handleClose: () => void
  handleConfirm: () => void
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
    >
      <DialogTitle>
        Are youy sure?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you want to delete this note?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
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
      </DialogActions>
    </Dialog>    
  )
}
