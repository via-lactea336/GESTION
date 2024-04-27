export type ApiResponseData<T=undefined> = {
  data?: T
  message?: string
  error?: string
  success: boolean
}

export type SignUpCredentials = {
  username: string
  password: string
}