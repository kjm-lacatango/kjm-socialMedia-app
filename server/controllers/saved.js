import jwt from 'jsonwebtoken'
import { db } from '../connectdb.js'

export const getSavedPosts = (req, res) => {
    const token = req.headers['x-access-token']

    if (!token) res.json({error: 'Not logged in!'})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})

        const q = `SELECT p.*, s.*, u.id AS uid, firstname, lastname, profile_pic from saved AS s join posts AS p on (p.id = s.postId) 
                JOIN users AS u on (u.id = p.userId) WHERE s.userId = ? ORDER BY p.createdAt DESC`
        db.query(q, info.id, (err, result) => {
            if (err) console.log(err)
            res.json({result: result})
        })
    })
}

export const addSavedPost = (req, res) => {
    const token = req.headers['x-access-token']
    const pid = req.body.pid

    if (!token) res.json({error: 'Not logged in!'})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})

        db.query('INSERT INTO saved (userId, postId) VALUES (?, ?)', [info.id, pid], (err, result) => {
            if (err) console.log(err)
            res.json({result: 'Successfully saved'})
        })
    })
}

export const unSaved = (req, res) => {
    const token = req.headers['x-access-token']
    const sid = req.params.sid

    if (!token) res.json({error: 'Not logged in!'})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})

        db.query('DELETE FROM saved WHERE id = ?', sid, (err, result) => {
            if (err) console.log(err)
            res.json({result: 'Successfully unsaved'})
        })
    })
}

export const delSaved = (req, res) => {
    const token = req.headers['x-access-token']
    const pid = req.params.pid

    if (!token) res.json({error: 'Not logged in!'})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})

        db.query('DELETE FROM saved WHERE postId = ? and userId = ?', [pid, info.id], (err, result) => {
            if (err) console.log(err)
            res.json({result: 'Successfully unsaved'})
        })
    })
}