import express from 'express'
const router = express.Router()
import {register, login, logout, updateFname, updateLname, updateProfile} from '../controllers/auth.js'

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.put('/updateFname', updateFname)
router.put('/updateLname', updateLname)
router.post('/updateProfile', updateProfile)

export default router