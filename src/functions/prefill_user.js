const User = require("../models/User");

const prefill_user = async()=>{
    const isItExist = await User.findOne({nama:'admin'})
    if (isItExist){
        return console.log('User Already exists')
    }else{
        const generate_user = new User({
            nama:'admin',
            email: 'admin@admin.com',
            password: 'admin12345678',
            role:'Petugas'

        })
        await generate_user.save()
    }
}

module.exports = {prefill_user}