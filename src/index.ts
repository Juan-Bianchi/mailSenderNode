import express from "express"
import authRouter from "./controllers/AuthController";
import userRouter from "./controllers/UserController";
import mailRouter from "./controllers/MailController";

const PORT = 3000;
const app = express()

app.use(express.json())

//controllers
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', mailRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

