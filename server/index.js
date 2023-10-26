import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
const app = express()
import multer from 'multer'
import path from 'path'
import userRouter from './routes/auth.js'
import postsRouter from './routes/post.js'
import relationshipRouter from './routes/relationshipRouter.js'
import likesRouter from './routes/like.js'
import commentRouter from './routes/comment.js'
import savedPostRouter from './routes/saved.js'

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}))
app.use(cookieParser())
app.use(express.static('public'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})

app.use('/api/auth', userRouter)
app.use('/api/posts', postsRouter)
app.use('/api/relationship', relationshipRouter)
app.use('/api/likes', likesRouter)
app.use('/api/comments', commentRouter)
app.use('/api/savedPosts', savedPostRouter)
app.post('/api/uploadImage', upload.single("image"), (req, res) => {
    const file = req.file
    res.json({result: file.filename})
})

app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`))