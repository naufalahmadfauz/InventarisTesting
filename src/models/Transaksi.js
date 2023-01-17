const mongoose = require('mongoose')

const transaksiSchema = new mongoose.Schema({
    nama_peminjam:{
        type:String,
        lowercase:false,
        required:true,
        unique:true,
        trim:true,
    },
    jumlah_barang:{
        type:Number,
        trim: true,
        required:true,
    }
},{
    timestamps:true
})

const Barang = mongoose.model('Barang',mailSchema)

module.exports = Barang