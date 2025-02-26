import React, { useEffect, useState } from "react";

interface EditProps {
  token: string; // The token for authentication
  isAuthenticated: boolean; // Indicates if the user is logged in
}

const Edit: React.FC<EditProps> = ({ token, isAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userInfo = await response.json();
        setUsername(userInfo.username);
        setEmail(userInfo.email);
      } else {
        setMessage("Failed to fetch user information.");
      }
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedUser = { username, email, password };

    const response = await fetch("http://localhost:3000/api/user/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedUser),
    });

    const resJson = await response.json();
    if (response.ok) {
      setMessage("User information updated successfully.");
    } else {
      setMessage(resJson.msg);
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in to edit your information.</div>;
  }

  return (
    <div>
      <h2>Edit Your Information</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
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
            placeholder="Leave blank for no change"
          />
        </div>
        <button type="submit">Update</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Edit;
