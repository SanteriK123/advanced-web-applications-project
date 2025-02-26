import React, { useState, useEffect } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface UserBrowserProps {
  token: string;
  isAuthenticated: boolean;
}

const UserBrowser: React.FC<UserBrowserProps> = ({
  token,
  isAuthenticated,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchRandomUser();
    }
  }, [isAuthenticated]);

  // Fetch a random user from the database excluding already liked accounts and the user itself
  const fetchRandomUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/browser", {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const resJson = await response.json();
        setUser(resJson);
      } else {
        const resJson = await response.json();
        setMessage(resJson.msg);
      }
    } catch (error) {
      setMessage("Server error");
    }
  };

  // Handling likes and dislikes by sending request to backend and then fetching a new user in their place
  const handleLike = async () => {
    if (user) {
      console.log("Liked user: " + user._id);
      try {
        const response = await fetch("http://localhost:3000/api/browser/like", {
          method: "post",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        });
        if (response.ok) {
          fetchRandomUser();
        } else {
          const resJson = await response.json();
          setMessage(resJson.msg);
        }
      } catch (error) {
        setMessage("Server error");
      }
    }
  };

  const handleDislike = async () => {
    if (user) {
      console.log("Disliked user:", user._id);
      try {
        const response = await fetch(
          "http://localhost:3000/api/browser/dislike",
          {
            method: "post",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(user),
          }
        );
        if (response.ok) {
          fetchRandomUser();
        } else {
          const resJson = await response.json();
          setMessage(resJson.msg);
        }
      } catch (error) {
        setMessage("Server error");
      }
      // Fetch the next random user
      fetchRandomUser();
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in to view users.</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <h2>{user.username}</h2>
          {/* Add more user details here */}
          <button onClick={handleLike}>Like</button>
          <button onClick={handleDislike}>Dislike</button>
        </div>
      ) : null}
      <p>{message}</p>
    </div>
  );
};

export default UserBrowser;
