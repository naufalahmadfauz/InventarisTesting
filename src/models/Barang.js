const mongoose = require('mongoose')

const barangSchema = new mongoose.Schema({
    judul_barang:{
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
    },
},{
    timestamps:true
})

const Barang = mongoose.model('Barang',barangSchema)

module.exports = Barang