import {db} from '../connectdb.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const register = (req, res) => {
    const {fname, lname, username, password} = req.body

    db.query('SELECT * FROM users WHERE firstname = ? AND lastname = ? AND username = ?', [fname, lname, username], (err, result) => {
        if (err) console.log(err)
        if (result.length > 0) {
            res.json({error: 'User already exist!'})
        }
    })

    const salt = bcrypt.genSaltSync(10)
    const hashedPass = bcrypt.hashSync(password, salt)
    const q = 'INSERT INTO users (firstname, lastname, username, password) VALUES (?, ?, ?, ?)'
    db.query(q, [fname, lname, username, hashedPass], (err, result) => {
        if (err) console.log(err)

        db.query('SELECT * FROM users WHERE firstname = ? AND username = ?', [fname, username], (err, result) => {
            if (err) console.log(err)
            const token = jwt.sign({id: result[0].id}, process.env.JWT_SECRET, {expiresIn: '1d'})
            res.cookie("token", token, {
                httpOnly: true
            })
            const {password, ...others} = result[0]
            res.json({message: 'Successfully Registered', result: others, token: token})
        })
    })
}

export const login = (req, res) => {
    const {username, password} = req.body

    db.query('SELECT * FROM users WHERE username = ?', username, (err, result) => {
        if (err) console.log(err)
        if (result.length > 0) {
            const checkPass = bcrypt.compareSync(password, result[0].password)
            if (checkPass) {
                const token = jwt.sign({id: result[0].id}, process.env.JWT_SECRET, {expiresIn: '1d'})
                res.cookie("token", token, {
                    httpOnly : true
                })
                const {password, ...others} = result[0]
                res.json({message: "Successfully login", result: others, token: token})
            } else {
                res.json({error: 'Incorrect password!'})
            }
        } else {
            res.json({error: 'User not found!'})
        }
    })
}

export const logout = (req, res) => {
    res.clearCookie("token")
    res.json({message: 'Successfully Logout'})
}

export const updateFname = (req, res) => {
    const newFname = req.body.newData
    const token = req.headers["x-access-token"]

    if (!token) res.json({error: "not logged in"})
    
    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: "token is not valid"})

        db.query('UPDATE users SET firstname = ? WHERE id = ?', [newFname, info.id], (err, result) => {
            if (err) console.log(err)

            db.query('SELECT * FROM users WHERE id = ?', info.id, (err, result) => {
                if (err) console.log(err)
                const {password, ...others} = result[0]
                res.json({result: others})
            })
        })
    })
}

export const updateLname = (req, res) => {
    const newLname = req.body.newData
    const token = req.headers["x-access-token"]

    if (!token) res.json({error: "Not logged in"})
    
    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: "token is not valid"})

        db.query('UPDATE users SET lastname = ? WHERE id = ?', [newLname, info.id], (err, result) => {
            if (err) console.log(err)

            db.query('SELECT * FROM users WHERE id = ?', info.id, (err, result) => {
                if (err) console.log(err)
                const {password, ...others} = result[0]
                res.json({result: others})
            })
        })
    })
}

export const updateProfile = (req, res) => {
    const image = req.body.image
    const token = req.headers["x-access-token"]

    if (!token) res.json({error: "Not logged in!"})

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) res.json({error: "Token not valid!"})

        db.query('UPDATE users SET profile_pic = ? WHERE id = ?', [image, info.id], (err, result) => {
            if (err) console.log(err)

            db.query('SELECT * FROM users WHERE id = ?', info.id, (err, result) => {
                if (err) console.log(err)
                const {password, ...others} = result[0]
                res.json({result: others})
            })
        })
    })
}