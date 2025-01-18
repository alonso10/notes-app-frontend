import { Box, Button, Grid2 as Grid, Modal, Typography } from '@mui/material'
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
