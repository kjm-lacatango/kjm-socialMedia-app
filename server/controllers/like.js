import jwt from 'jsonwebtoken'
import { db } from '../connectdb.js'

export const addLike = (req, res) => {
    const token = req.headers["x-access-token"]
    const pid = req.body.pid

    if (!token) res.json({error: 'Not logged in!'})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})

        db.query('INSERT INTO likes (userId, postId) VALUES (?, ?)', [info.id, pid], (err, result) => {
            if (err) console.log(err)
            res.json({result: 'Successfully liked'})
        })
    })
}

export const getLikes = (req, res) => {
    const token = req.headers["x-access-token"]
    const pid = req.params.pid

    if (!token) res.json({error: 'Not logged in!'})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})

        db.query('SELECT userId FROM likes WHERE postId = ?', pid, (err, result) => {
            if (err) console.log(err)
            res.json({result: result.map(r => r.userId)})
        })
        // res.json({result: pid, sdf: token, sd: 'sd'})
    })
}

export const unLike = (req, res) => {
    const token = req.headers["x-access-token"]
    const pid = req.params.pid

    if (!token) res.json({error: 'Not logged in!'})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})

        db.query('DELETE FROM likes WHERE userId = ? AND postId = ?', [info.id, pid], (err, result) => {
            if (err) console.log(err)
            res.json({result: 'Successfully unLiked'})
        })
    })
}