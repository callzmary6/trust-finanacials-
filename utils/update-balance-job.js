const User = require('../models/User');
const cron = require('node-cron');
const Deposit = require('../models/Deposit');


const displayData = async () => {
    const users = await User.find({});
    const deposits = await Deposit.find({isPending: false});
    var totalPercentage = 0;


    for (const user of users) {
        // for (const deposit of deposits) {
        //     if (deposit.user === user._id) {
        //         totalPercentage += deposit.percentIncrease;
        //     }
            
        // }
        user.isSuspended = false;
        user.save();
    }
    console.log('updated....')
}



const task = cron.schedule('*/10 * * * * *', displayData, {scheduled: false});


module.exports = task;