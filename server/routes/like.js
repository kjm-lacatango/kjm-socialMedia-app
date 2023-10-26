import express from 'express'
const Router = express.Router()
import { addLike, getLikes, unLike } from '../controllers/like.js'

Router.post('/addLike', addLike)
Router.get('/getLikes/:pid', getLikes)
Router.delete('/unLike/:pid', unLike)

export default Router