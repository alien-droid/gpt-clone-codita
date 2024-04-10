import express from 'express';
import * as dotenv from 'dotenv'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai';


dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY_SECRET);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});


const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello World!'
    })
})

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt
        const result = await model.generateContent(prompt);
        const response = result.response
        res.status(200).send({
            bot: response.text()
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({
            message: err
        })
    }

})

app.listen(5000, () => {
    console.log('Server running on port 5000')
})