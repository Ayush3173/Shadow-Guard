import { useEffect, useState } from "react";
import socket from "../services/socket";

export default function ConnectionStatus() {
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={`h-2 w-2 rounded-full ${
          connected ? "bg-green-400" : "bg-red-400"
        }`}
      />

      <span className={connected ? "text-green-400" : "text-red-400"}>
        {connected ? "Live" : "Disconnected"}
      </span>
    </div>
  );
}