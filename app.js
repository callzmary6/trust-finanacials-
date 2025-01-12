require("express-async-errors");
require("dotenv").config();

const express = require("express");
const app = express();

const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFoundMiddleware = require("./middlewares/not-found");
const authMiddleware = require('./middlewares/auth');

const connectDB = require("./db/connect");

const authRouter = require("./routes/auth");
const investmentRouter = require('./routes/investment');

const cors = require('cors');

const PORT = process.env.PORT || 3000;

const taskJob = require('./utils/update-balance-job'); // check this line

// Admin Routers
const adminInvestmentRouter = require('./admin/routes/investment');
const adminAccountRouter = require('./admin/routes/accounts');

app.use(cors());

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/investment", authMiddleware, investmentRouter);
app.use("/api/v1/admin", adminInvestmentRouter);
app.use("/api/v1/admin/accounts", adminAccountRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log("Server is active...");
    });
    taskJob.start(); // Starts the cron schedule
  } catch (error) {
    console.log(error);
  }
};





start();
