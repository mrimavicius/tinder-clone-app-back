const express = require("express")
const session = require("express-session")
const app = express()
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")
const mongoose = require("mongoose")
const mainRouter = require("./routes/mainRouter")
require("dotenv").config()

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

const PORT = 4000

server.listen(PORT, () => {
    console.log("SERVER IS RUNNING ON PORT " + PORT)
})

app.use(express.json())
app.use(
  session({
    secret: "dadadad1ni51902311321621dadsg23r/..<",
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/", mainRouter)

// MongoDB connection

const URI = process.env.MONGO_KEY

const connectDB = async () => {
    try {
        await mongoose.connect(URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        console.log("MongoDB connected")
    } catch (err) {
        console.log("Failed to connect to MongoDB", err)
    }
}

connectDB()