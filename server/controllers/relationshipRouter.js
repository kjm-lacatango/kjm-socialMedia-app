import jwt from 'jsonwebtoken'
import { db } from '../connectdb.js'

export const getRelation = (req, res) => {
    const token = req.headers["x-access-token"]

    if (!token) res.json({error: "Not logged in!"})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})

        db.query('SELECT followedUid FROM relationship WHERE followerUid = ?', info.id, (err, result) => {
            if (err) console.log(err)
            res.json({result: result.map(r => r.followedUid)})
        })
    })
}

// export const addRelation = (req, res) => {
//     // const {uid} = req.params
//     const token = req.headers["x-access-token"]

//     // if (!token) res.json({error: "Not logged in!"})

//     // jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
//     //     if (err) res.json({error: 'Token not valid!'})

//         // db.query('INSERT INTO relationship (followedUid, followerUid) VALUES (?, ?)', [uid, info.id], (err, result) => {
//         //     if (err) console.log(err)
//         //     res.json({result: "Successfully followed"})
//         // })
//     // })
// }

export const addRelation = (req, res) => {
    const token = req.headers["x-access-token"]
    const uid = req.body.uid

    if (!token) res.json({error: 'Not logged in!'})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})

        db.query('INSERT INTO relationship (followedUid, followerUid) VALUES (?, ?)', [uid, info.id], (err, result) => {
            if (err) console.log(err)
            res.json({result: "Successfully followed"})
        })
    })
}

export const deleteRelation = (req, res) => {
    const {uid} = req.params
    const token = req.headers["x-access-token"]

    if (!token) res.json({error: "Not logged in!"})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: 'Token not valid!'})

        db.query('DELETE FROM relationship WHERE followedUid = ? AND followerUid = ?', [uid, info.id], (err, result) => {
            if (err) console.log(err)
            res.json({result: "Successfully unfollowed"})
        })
    })
}