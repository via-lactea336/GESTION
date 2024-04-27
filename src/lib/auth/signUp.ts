
const signUp = async (username: string, password: string) => {

  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify({
      username: username,
      password: password
    })
  })

  return res

}

export default signUp