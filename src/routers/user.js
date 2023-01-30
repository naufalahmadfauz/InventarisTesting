const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')



router.get('/login', async (req, res)=> {
    if (req.flash){
        res.render('login',{titlepage:'Login',logininfo:req.flash('loginInfo')})
    }else {
        res.render('login',{titlepage:'Login'})
    }
})

router.get('/signup', async (req, res)=> {
    if (req.flash){
        res.render('signup',{titlepage:'Signup',signupInfo:req.flash('signupInfo')})
    }else {
        res.render('signup',{titlepage:'Signup'})
    }
})
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
        res.redirect('/users/me')
        // res.status(201).send({user})
    } catch (e) {
        console.log(e)
        req.flash('signupInfo','email telah terdaftar atau password mengandung kata password dan kurang dari 6 kata')
        res.redirect('/signup')
        // res.status(500).send(e)
    }
})
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        req.session.userid = user._id.toString()
        res.redirect('/users/me')
        // res.send({user})
    } catch (e) {

        req.flash('loginInfo', 'Username or password incorrect')
        res.redirect('/login')
        // res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.session.destroy(() => {
            res.redirect('/login')
            // res.status(200).send()
        })
    } catch (e) {
        res.redirect('/users/me')
        // res.status(500).send()
    }
})


router.get('/',async (req,res)=>{
    res.status(200).redirect('/login')
    // res.render('profile',{titlepage:'Profile'})
})
router.get('/users/me',auth, async (req, res) =>{
     try{
         const users = await User.findById({_id:req.user.id}).populate({path:'daftar_transaksi'})
         res.render('profile',{
             nama:users.nama,
             email:users.email,
             role:users.role
         })
         // res.send(users)
     }catch(e){
         res.redirect('/users/me')
         // res.status(500).send(e)
     }
})

router.get('/users',auth,async(req,res)=>{
    try {
        if (req.user.role === 'Petugas'){
            const users = await User.find({})
            res.render('daftar_user',{
                titlepage:'Daftar Users',
                users,
                show:'yes'
            })
        }else {
            res.redirect('/users/me')
        }

        // res.send()
    }catch (e) {
        res.status(500).send(e)
    }

})
router.get('/users/edit/me',auth,async (req,res)=>{
    const user = req.user
    if (user.role === 'Petugas'){
        res.render('edit_profile',{user})
    }else{
        res.render('edit_profile_user',{user})
    }
})
router.get('/users/edit/:id',auth,async (req,res)=>{
    const user = await User.findById(req.params.id)
    res.render('edit_user',{user})
})

router.patch('/users/edit/me', auth, async (req, res) => {
    if (req.body.password ===''){
        delete req.body.password
    }
    if (req.body.role ===''){
        delete req.body.role
    }

    const updates = Object.keys(req.body)
    const allowedUpdates = ['nama', 'email', 'password', 'role']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }else if (req.user.role==='Siswa' && req.body.role){
        return res.status(401).send({error: 'You do not have permission to change role'})
    }
    try {
            console.log(req.body)
            updates.forEach((update => req.user[update] = req.body[update]))
            await req.user.save()
            res.redirect('/users/me')
        // res.send(req.user)
    } catch (e) {
        res.redirect('/users/me')
        // res.status(400).send(e)
    }
})

router.patch('/users/:id', auth, async (req, res) => {
    if (req.user.role==='Siswa' && req.body.role){
        return res.status(401).redirect('/users/me')
    }
    if (req.body.password ===''){
        delete req.body.password
    }
    const updates = Object.keys(req.body)
    const allowedUpdates = ['nama', 'email', 'password', 'role']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).redirect('/users/me')
    }
    try {
        const users = await User.findById(req.params.id)
            updates.forEach((update => users[update] = req.body[update]))
            await users.save()
            res.redirect('/users/me')
        // res.send(req.user)
    } catch (e) {
        res.redirect('/users/me')
        // res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.redirect('/login')
        // res.send(req.user)
    } catch (e) {
        res.redirect('/users/me')
        // res.status(500).send()
    }
})
router.delete('/users/delete/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        await user.remove()
        res.redirect('/login')
        // res.send(req.user)
    } catch (e) {
        res.redirect('/users/me')
        // res.status(500).send()
    }
})

module.exports = router