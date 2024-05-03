const signUp = async (username: string, password: string) => {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    if (res.ok) {
      return null;
    }
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
  }
};

export default signUp;
