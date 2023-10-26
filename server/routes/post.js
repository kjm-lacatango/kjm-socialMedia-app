import express from 'express'
const router = express.Router()
import {createPost, getPosts, getFollowedPosts, delPost, getMyPost} from '../controllers/post.js'

router.post('/createPost', createPost)
router.get('/getPosts', getPosts)
router.get('/getMyPosts', getMyPost)
router.get('/getFollowedPosts', getFollowedPosts)
router.delete('/deletePost/:id', delPost)

export default router