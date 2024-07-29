import React from "react";
import { useEffect, useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function registerUser(user: any) {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const resJson = await response.json()
    console.log(resJson)
    if (response.ok) {
      setMessage("Account succesfully created!");
    } else {
      setMessage(resJson.msg)
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const user = { email, password };
    registerUser(user)
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
