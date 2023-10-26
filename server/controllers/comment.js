import jwt from 'jsonwebtoken'
import { db } from '../connectdb.js'
import moment from 'moment/moment.js'

export const getComments = (req, res) => {
    const {pid} = req.params
    const token = req.headers['x-access-token']

    if (!token) res.json({error: 'Not logged in!'})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})
        
        const q = `SELECT c.*, u.id AS uid, profile_pic, firstname, lastname FROM comments AS c JOIN users AS u on (u.id = c.userId)
                WHERE c.postId = ? ORDER BY c.createdAt`
        db.query(q, pid, (err, result) => {
            if (err) console.log(err)
            res.json({result: result})
        })
        // res.json({result: pid})
    })
}

export const addComment = (req, res) => {
    const pid = req.body.pid
    const desc = req.body.desc
    const token = req.headers["x-access-token"]

    if (!token) res.json({error: 'Not logged in!'})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})
        
        const q = 'INSERT INTO comments (comment, createdAt, userId, postId) VALUES (?, ?, ?, ?)'
        db.query(q, [desc, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), info.id, pid], (err, result) => {
            if (err) console.log(err)
            res.json({result: 'Successfully commented'})
        })
        // res.json({result: token, postId: pid, desc: desc})
    })
}

export const deleteComment = (req, res) => {
    const cid = req.params.cid
    const token = req.headers["x-access-token"]

    if (!token) res.json({error: 'Not logged in!'})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})

        db.query('DELETE FROM comments WHERE id = ?', cid, (err, result) => {
            if (err) console.log(err)
            res.json({result: 'Successfully deleted'})
        })
    })
}