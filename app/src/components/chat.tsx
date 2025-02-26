import React, { useState, useEffect } from "react";
import "./chat.css"

interface User {
  _id: string;
  username: string;
  email: string;
}

interface ChatProps {
  token: string;
  isAuthenticated: boolean;
}

const Chat: React.FC<ChatProps> = ({ token, isAuthenticated }) => {
  const [mutualLikes, setMutualLikes] = useState<User[]>([]);
  const [selectedChat, setSelectedChat] = useState<{
    _id: string;
    user1: string;
    user2: string;
    messages: any[];
  } | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchMutualLikes();
    }
  }, [isAuthenticated]);

  const fetchMutualLikes = async () => {
    try {
      // This gets all the likes that went both ways, and chats will get opened with those people
      const response = await fetch("http://localhost:3000/api/mutual-likes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMutualLikes(data);
      } else {
        console.log("Failed to get users with mutual likes");
      }
    } catch (error: any) {
      console.log("Server error:", error.message);
    }
  };

  const openChat = async (userId: string) => {
    try {
      // Get all messages of the chat from the backend
      const response = await fetch(`http://localhost:3000/api/chat/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedChat(data);
        // Map out all the messages in format "user: message"
        setMessages(
          data.messages.map(
            (message: any) => `${message.sender}: ${message.content}`
          )
        );
      } else {
        console.log("Failed to open chat");
      }
    } catch (error: any) {
      console.log("Server error:", error.message);
    }
  };

  const sendMessage = async () => {
    if (!selectedChat) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/chat/${selectedChat._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newMessage }),
        }
      );
      if (response.ok) {
        // Update the messages on the front end and clear the new message
        setMessages([...messages, `You: ${newMessage}`]);
        setNewMessage("");
      } else {
        console.log("Failed to send message");
      }
    } catch (error: any) {
      console.log("Server error:", error.message);
    }
  };
  
  if (!isAuthenticated) {
    return <div>Please log in to view and send messages.</div>;
  }

  // This has some spaghetti code to map out all the mutually liked users, and then for those users all of their chats.
  return (
    <div>
      <div>
        <h2>Start chatting</h2>
        <ul>
          {mutualLikes.map((user) => (
            <li key={user._id} onClick={() => openChat(user._id)}>
              {user.username}
            </li>
          ))}
        </ul>
      </div>
      {selectedChat && (
        <div>
          <h2>Chat:</h2>
          <div>
            {messages.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Chat;
