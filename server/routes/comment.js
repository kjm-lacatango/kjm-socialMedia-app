import express from "express";
import { addComment, deleteComment, getComments } from "../controllers/comment.js";
const Router = express.Router()

Router.get('/getComments/:pid', getComments)
Router.post('/addComment', addComment)
Router.delete('/deleteComment/:cid', deleteComment)

export default Router