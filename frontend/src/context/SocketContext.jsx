import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [onlineUsers, setOnlineUsers] = useState(new Map());

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    
    // Polling as a fallback for same-window changes
    const interval = setInterval(handleStorageChange, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let newSocket;

    if (!token) return;

    const socketUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    newSocket = io(socketUrl, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("[Socket] Connected to server:", newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    newSocket.on("status_update", (data) => {
      setOnlineUsers((prev) => {
        const next = new Map(prev);
        const uid = String(data.userId);
        next.set(uid, {
          isOnline: data.isOnline,
          status: data.status,
          lastSeen: data.lastSeen,
        });
        return next;
      });
    });
    
    newSocket.on("initial_presence", (usersList) => {
      setOnlineUsers((prev) => {
        const next = new Map(prev);
        usersList.forEach(user => {
          next.set(String(user.userId), {
            isOnline: user.isOnline,
            status: user.status,
            lastSeen: user.lastSeen,
          });
        });
        return next;
      });
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
        setSocket(null);
      }
    };
  }, [token]); 

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
