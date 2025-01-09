const mongoose = require('mongoose');


const BonusSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: String,
    percentBonus: Number
})





module.exports = mongoose.model('Bonus', BonusSchema);