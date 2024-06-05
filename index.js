import express from "express"
import { dbConnection} from "./db.js"
import { userRouter } from "./routers/users.js"
import bodyParser from "body-parser"
import cors from "cors"
import { isAuthendicated } from "./middlewares/auth.js"

//init the server
const app =express()
//db connection
dbConnection()

// Configure Express middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//routers
app.use("/users",userRouter)

//listening the server
app.listen(9090, ()=>console.log("server running in localhost:9090"))