const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Barang = require('../models/Barang')

router.post('/barang/baru',auth, async (req, res) => {
    const barang = new Barang(req.body)
    const barangInput = Object.keys(req.body)
    const allowedInput = ['judul_barang', 'jumlah_barang']
    const isValidOperation = barangInput.every((update) => allowedInput.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Bad Inputs'})
    }else if (req.user.role==='Siswa'){
        return res.status(401).send({error: 'You do not have permission to add barang'})
    }
    try {
        await barang.save()
        res.status(201).send({barang})
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/barang', auth, async (req, res) => {
    const barang = await Barang.find({})
    res.send(barang)
})

router.patch('/barang/edit/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['judul_barang', 'jumlah_barang']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }else if (req.user.role==='Siswa'){
        return res.status(401).send({error: 'You do not have permission to change barang'})
    }
    try {
        const barang = await Barang.findById({_id: req.params.id})
        updates.forEach((update => barang[update] = req.body[update]))
        await barang.save()
        res.send(req.barang)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/barang/hapus/:id', auth, async (req, res) => {
    if (req.user.role==='Siswa'){
        return res.status(401).send({error: 'You do not have permission to delete barang'})
    }
    try {
        const barang = await Barang.findById({_id: req.params.id})
        await barang.remove()
        res.send(barang)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router