import express from "express"
const app = express()
app.use(express.json()) // middleware que transforma la req.body a un json

const PORT = 3000;

import mailRouter from './routes/mailRouter'

app.get('/ping', (_req, res) => {
    console.log("someone pinged here!!");
    res.send('pong amigo!');
})

app.use('/api/mails', mailRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
