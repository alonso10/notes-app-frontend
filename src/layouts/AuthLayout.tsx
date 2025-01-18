import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Box } from '@mui/material'
import { NotebookPen } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { auth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth) {
      navigate('/dashboard')
    }
  }, [auth, navigate])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(120deg,rgb(159, 196, 226) 0%,rgb(71, 91, 110) 100%)',
        py: 8,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <NotebookPen size={48} color="white" />
          </Box>
          {children}
        </Box>
      </Container>
    </Box>
  )
}
