const express = require('express');
import connectDB from './db/connectDb'
if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: false }))

//connection to mongoDB database
connectDB();

//set view engine
app.set('view engine', 'ejs');

//set routes
app.use("/auth", require('./routes/auth'))
app.use("/user", require('./routes/user'))

app.get("/", (req, res) => {
    res.render('index')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server stared on port ${PORT}`));