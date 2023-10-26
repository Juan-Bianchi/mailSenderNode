import express from "express"
import authRouter from "./controllers/AuthController";
import userRouter from "./controllers/UserController";
import mailRouter from "./controllers/MailController";

const PORT = 3000;
const app = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended: false}))

//controllers
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', mailRouter);

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


export {app, server};

