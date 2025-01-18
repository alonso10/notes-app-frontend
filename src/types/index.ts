export type Note = {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export type User = {
  id: number
  name: string
  email: string
}

export type UserCredentials = {
  token: string
}

export type UserAuthenticated = {
  user: User
  auth: UserCredentials
}
