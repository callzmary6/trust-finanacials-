const User = require('../models/User');
const cron = require('node-cron');
const Deposit = require('../models/Deposit');


const updateBalance = async () => {
    try {
        const deposits = await Deposit.find({isPending: false, daysRemaining: {$gt: 0}});

        for (const deposit of deposits) {
            const user = await User.findOne({_id: deposit.user});

            if (!user) continue;

            // Add daily earning's to user's balance
            user.balance += deposit.dailyEarning;
            await user.save();

            // Update referral's balance
            if (user.referredBy) {
                const referrer = await User.findOne({_id: user.referredBy});
                if (referrer) {
                    referrer.balance += deposit.dailyEarning * 0.1;
                    await referrer.save();
                }
            }

            // Reduce the number of days
            deposit.daysRemaining -= 1;
            await deposit.save();

            console.log('updated....');
        }
    } catch (error) {
        console.log(`Error during daily updates: ${error}`)
    }
}



const task = cron.schedule('0 0 * * *', updateBalance, {scheduled: false});




module.exports = task;