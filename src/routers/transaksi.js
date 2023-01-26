const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Transaksi = require('../models/Transaksi')
const Barang = require('../models/Barang')
router.post('/transaksi/baru/:idBarang',auth, async (req, res) => {
    const transaksi = new Transaksi({
        ...req.body,
        nama_peminjam:req.user.id,
        nama_barang:req.params.idBarang,
    })
    const transaksiInput = Object.keys(req.body)
    const allowedInput = ['jumlah_barang']
    const isValidOperation = transaksiInput.every((update) => allowedInput.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Bad Inputs'})
    }
    try {
        const barang = await Barang.findById({_id:req.params.idBarang})
        if (transaksi.jumlah_barang > barang.jumlah_barang) {
            res.status(204).send('Barang yang dipesan tidak boleh lebih dari stok')
        }else{
            barang.jumlah_barang -= transaksi.jumlah_barang
            await transaksi.save()
            await barang.save()
            res.status(201).send({transaksi})
        }


    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/transaksi', auth, async (req, res) => {
    if (req.user.role==='Petugas'){
        let transaksi = await Transaksi.find({}).populate({path:'nama_peminjam'}).populate({path:'nama_barang'})
        console.log(transaksi)
    }else{
        let transaksi = await Transaksi.find({nama_peminjam:req.user.id}).populate({path:'nama_peminjam'}).populate({path:'nama_barang'})
        console.log(transaksi)
    }

    res.send()
})

router.patch('/transaksi/selesai/:idTransaksi', auth, async (req, res) => {
    if (req.user.role==='Siswa'){
        return res.status(401).send({error: 'You do not have permission to change transaksi'})
    }
    try {
        const transaksi = await Transaksi.findById({_id: req.params.idTransaksi}).populate({path:'nama_barang'})
        const barang = await Barang.findById({_id:transaksi.nama_barang._id})
        barang.jumlah_barang += transaksi.jumlah_barang
        transaksi.status_pinjaman = 'Selesai'
        await transaksi.save()
        await barang.save()
        res.send()
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/transaksi/hapus/:id', auth, async (req, res) => {
    if (req.user.role==='Siswa'){
        return res.status(401).send({error: 'You do not have permission to delete transaksi'})
    }
    try {
        const transaksi = await Transaksi.findById({_id: req.params.id})
        const barang = await Barang.findById({_id:transaksi.nama_barang._id})
        barang.jumlah_barang += transaksi.jumlah_barang
        await transaksi.remove()
        await barang.save()
        res.send(transaksi)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router