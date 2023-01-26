const mongoose = require('mongoose')

const transaksiSchema = new mongoose.Schema({
    nama_peminjam:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    nama_barang:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Barang'
    },
    jumlah_barang:{
        type:Number,
        trim: true,
        required:true,
    },
    status_pinjaman: {
        type:String,
        required:true,
        default:'Dipinjam'
    }
},{
    timestamps:true
})

const Transaksi = mongoose.model('Transaksi',transaksiSchema)

module.exports = Transaksi