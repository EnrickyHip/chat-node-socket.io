module.exports = (io) => {
  io.on("connection", (socket) => {
    // console.log("socket: ", socket);
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("the user disconnected");
    });

    socket.on("send message", (data) => {
      socket.emit("add message", { ...data });
      socket.broadcast.emit("add message", { ...data });
    });
  });
};
