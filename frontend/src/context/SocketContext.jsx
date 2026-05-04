import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Map());

  useEffect(() => {
    let newSocket;

    const connectSocket = () => {
      const token = localStorage.getItem("token");
      if (!token || socket) return; // Don't connect if no token or already connected

      const socketUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      newSocket = io(socketUrl, {
        auth: { token },
        transports: ["websocket"],
      });

      newSocket.on("connect", () => {
        console.log("[Socket] Connected to server");
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

      setSocket(newSocket);
    };

    // Initial attempt
    connectSocket();

    // Check periodically if socket is not connected but token exists
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!socket && token) {
        connectSocket();
      }
    }, 2000);

    return () => {
      if (newSocket) newSocket.disconnect();
      clearInterval(interval);
    };
  }, [socket]); // Keep socket to allow cleanup, but connectSocket checks if socket exists

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
