const mongoose = require('mongoose')
const Transaksi = require('./Transaksi')
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

barangSchema.virtual('list_transaksi',{
    ref:'Transaksi',
    localField:'_id',
    foreignField:'nama_barang'
})

barangSchema.pre('remove', async function (next) {
    const barang = this
    await Transaksi.deleteMany({ nama_barang: barang._id })
    next()
})

const Barang = mongoose.model('Barang',barangSchema)

module.exports = Barang