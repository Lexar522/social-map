export function initSocket(io) {
    io.on("connection", socket => {
      console.log("User connected");
  
      socket.on("new_pin", data => {
        io.emit("pin_added", data);
      });
  
      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }
  