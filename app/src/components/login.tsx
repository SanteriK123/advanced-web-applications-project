import React from "react";
import { useState } from "react";

interface LoginProps {
  onLogin: (token: string, email: string) => void;
  token: string;
  isAuthenticated: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, token , isAuthenticated}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function loginUser(user: any) {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });
    const resJson = await response.json();
    if (response.ok) {
      setMessage("Account login successful. Refresh page to make sure everything works");
      onLogin(resJson.token, resJson.email);
    } else {
      setMessage(resJson.msg);
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const user = { email, password };
    loginUser(user);
  };

  if (isAuthenticated) {
    return <div>Please log out to see this page. Refresh to make sure authorization works correctly.</div>;
  }

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
};

export default Login;
