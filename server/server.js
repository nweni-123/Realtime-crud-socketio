const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let crudData = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ချိတ်ဆက်ပြီးသား User ကို လက်ရှိ Data စာရင်း ချက်ချင်းပို့ခြင်း
  socket.emit("crudData", crudData);

  // Create: Data အသစ်ထည့်ခြင်း
  socket.on("data", (formInputs) => {
    const newItem = {
      id: uuidv4(),
      name: formInputs.name,
      age: formInputs.age,
      phone: formInputs.phone,
    };
    crudData.push(newItem);
    io.emit("crudData", crudData);
  });

  // Update: Data ပြင်ဆင်ခြင်း
  socket.on("editData", (updatedItem) => {
    const currentIndex = crudData.findIndex((item) => item.id === updatedItem.id);
    if (currentIndex !== -1) {
      crudData[currentIndex] = { ...crudData[currentIndex], ...updatedItem };
      io.emit("crudData", crudData);
    }
  });

  // Delete: Data ဖျက်ခြင်း
  socket.on("deleteData", (id) => {
    const currentIndex = crudData.findIndex((item) => item.id === id);
    if (currentIndex !== -1) {
      crudData.splice(currentIndex, 1);
      io.emit("crudData", crudData);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log("Server is running!");
});