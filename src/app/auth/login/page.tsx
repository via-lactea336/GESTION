"use client"

import React from 'react'
import { signIn } from 'next-auth/react'

export default function Login() {

  const [formMessage, setFormMessage] = React.useState<string | null>("")
  const [formData, setFormData] = React.useState({
    username: "",
    password: ""
  })

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const res = await signIn('credentials', {...formData, redirect: false})
    
    console.log(res)
    setFormMessage(res?.error ?? "")
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
    console.log(formData)
  }

  return (
    <div>
      <form
        onSubmit={onSubmitHandler}
      >
        <h1>Login</h1>
        <input onChange={onChange} name="username" type="text" placeholder="Enter your username" />
        <input onChange={onChange} name="password" type="password" placeholder="Enter your Password" />
        <button>Login</button>
        <p className='text-red-500'>{formMessage}</p>
      </form>
    </div>
  )
}