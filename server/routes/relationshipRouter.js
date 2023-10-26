import express from 'express'
const Router = express.Router()
import {getRelation, addRelation, deleteRelation} from '../controllers/relationshipRouter.js'

Router.get('/getRelation', getRelation)
Router.post('/addRelation', addRelation)
Router.delete('/deleteRelation/:uid', deleteRelation)

export default Router