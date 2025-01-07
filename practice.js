const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  balance: { type: Number, required: true },
  dailyPercentage: { type: Number, required: true }, // e.g., 0.01 for 1% daily growth
  lastUpdateDate: { type: Date, required: true, default: Date.now },
});

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment;


const cron = require('node-cron');
const Investment = require('./models/investment');

async function updateDailyBalances() {
  const now = new Date();

  const investments = await Investment.find();
  for (const investment of investments) {
    const daysSinceLastUpdate = Math.floor((now - investment.lastUpdateDate) / (1000 * 60 * 60 * 24));
    if (daysSinceLastUpdate > 0) {
      investment.balance *= Math.pow(1 + investment.dailyPercentage, daysSinceLastUpdate);
      investment.lastUpdateDate = now; // Update the last update date
      await investment.save();
    }
  }

  console.log('Daily balances updated!');
}

// Schedule the task to run at midnight every day
cron.schedule('0 0 * * *', updateDailyBalances);



// Run job on request
app.get('/investment/:id', async (req, res) => {
  const investment = await Investment.findById(req.params.id);
  if (!investment) return res.status(404).send('Investment not found');

  const now = new Date();
  const daysSinceLastUpdate = Math.floor((now - investment.lastUpdateDate) / (1000 * 60 * 60 * 24));

  if (daysSinceLastUpdate > 0) {
    investment.balance *= Math.pow(1 + investment.dailyPercentage, daysSinceLastUpdate);
    investment.lastUpdateDate = now; // Update the last update date
    await investment.save();
  }

  res.json(investment);
});