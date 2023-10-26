import express from 'express'
import { getSavedPosts, addSavedPost, unSaved, delSaved } from '../controllers/saved.js'
const Router = express.Router()

Router.get('/getSavedPosts', getSavedPosts)
Router.post('/addSavedPost', addSavedPost)
Router.delete('/unSavedPost/:sid', unSaved)
Router.delete('/delSavedPost/:pid', delSaved)

export default Router