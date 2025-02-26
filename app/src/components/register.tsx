import React from "react";
import { useState } from "react";

interface RegisterProps {
  token: string;
  isAuthenticated: boolean;
}

const Register: React.FC<RegisterProps> = ({ token, isAuthenticated}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function registerUser(user: any) {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
        
      },
      body: JSON.stringify(user),
    });
    const resJson = await response.json();
    console.log(resJson);
    if (response.ok) {
      setMessage("Account succesfully created!");
    } else {
      setMessage(resJson.msg);
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const user = { username, email, password };
    registerUser(user);
  };

  if (isAuthenticated) {
    return <div>Please log out to see this page.</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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

export default Register;
