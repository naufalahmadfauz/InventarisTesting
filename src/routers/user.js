const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')

router.post('/signup', async (req, res) => {
    const user = new User(req.body)
    const userInput = Object.keys(req.body)
    const allowedInput = ['nama', 'email', 'password']
    const isValidOperation = userInput.every((update) => allowedInput.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Bad Inputs'})
    }
    try {
        await user.save()
        req.session.userid = user._id.toString()
        res.status(201).send({user})
    } catch (e) {
        res.status(500).send(e)
    }
})
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        req.session.userid = user._id.toString()
        res.send({user})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.session.destroy(() => {
            res.status(200).send()
        })
    } catch (e) {
        res.status(500).send()
    }
})
//TODO
//Implement logoutAll

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['nama', 'email', 'password', 'role']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }else if (req.user.role==='Siswa'){
        return res.status(401).send({error: 'You do not have permission to change role'})
    }
    try {
        updates.forEach((update => req.user[update] = req.body[update]))
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router