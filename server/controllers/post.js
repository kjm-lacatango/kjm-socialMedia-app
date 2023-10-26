import jwt from 'jsonwebtoken'
import {db} from '../connectdb.js'
import moment from 'moment/moment.js'

export const createPost = (req, res) => {
    const token = req.headers["x-access-token"]
    const desc = req.body.desc
    const image = req.body.image

    if (!token) res.json({error: "Not logged in!"})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: "Token not valid!"})

        if (image && desc) {
            const q = 'INSERT INTO posts (description, image, userId, createdAt) VALUES (?, ?, ?, ?)'
            db.query(q, [desc, image, info.id, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")], (err, result) => {
                if (err) console.log(err)
                res.json({result: "Successfully uploaded"})
            })
        } else if (image) {
            const q = 'INSERT INTO posts (image, userId, createdAt) VALUES (?, ?, ?)'
            db.query(q, [image, info.id, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")], (err, result) => {
                if (err) console.log(err)
                res.json({result: "Successfully uploaded"})
            })
        } else if (desc) {
            const q = 'INSERT INTO posts (description, userId, createdAt) VALUES (?, ?, ?)'
            db.query(q, [desc, info.id, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")], (err, result) => {
                if (err) console.log(err)
                res.json({result: "Successfully uploaded"})
            })
        }
        
    })
}

export const getPosts = (req, res) => {
    const token = req.headers["x-access-token"]

    if (!token) res.json({error: 'Not Logged in!'})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: "Token not valid!"})

        const q = `select p.*, u.id AS uid, firstname, lastname, profile_pic from posts AS p 
                JOIN users AS u on (u.id = p.userId) order by p.createdAt desc`
        db.query(q, (err, result) => {
            if (err) console.log(err)
            res.json({result: result})
        })
    })
}

export const getFollowedPosts = (req, res) => {
    const token = req.headers["x-access-token"]

    if (!token) res.json({error: "Not logged in!"})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})

        const q = `select p.*, u.id AS uid, firstname, lastname, profile_pic from posts AS p JOIN users AS u on (u.id = p.userId)
                left join relationship AS r on (p.userId = r.followedUid) where r.followerUid = ? order by p.createdAt desc`
        db.query(q, info.id, (err, result) => {
            if (err) console.log(err)
            res.json({result: result})
        })
    })
}

export const delPost = (req, res) => {
    const id = req.params.id
    const token = req.headers["x-access-token"]

    if (!token) res.json({error: "Not logged in!"})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})

        db.query('delete from posts where id = ?', id, (err, result) => {
            if (err) console.log(err)
            res.json({result: 'Successfully deleted'})
        })
    })
}

export const getMyPost = (req, res) => {
    const token = req.headers['x-access-token']

    if (!token) res.json({error: 'Not logged in!'})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})

        const q = `SELECT p.*, u.id AS uid, firstname, lastname, profile_pic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
                WHERE p.userId = ? ORDER BY createdAt DESC`
        db.query(q, info.id, (err, result) => {
            if (err) console.log(err)
            res.json({result: result})
        })
    })
}