const express = require("express");
const path = require('path')
require("dotenv").config({path:path.resolve(__dirname, '.env')});
const colors = require('colors')
const {errorHandler} = require("./middleware/errorMiddleware")
const connectDB = require('./config/db')
const app = express();
const PORT = process.env.PORT;



//Connect to DB
connectDB()

app.use(express.json());
app.use(express.urlencoded({extended: true, parameterLimit:50000}));

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/posts', require('./routes/postRoutes'))
app.use('/api/posts', require('./routes/likeRoutes'))

//Serve Frontend
// if (process.env.NODE_ENV === 'production') {
//   // Set build folder as static
//   app.use(express.static(path.join(__dirname, '../frontend/build')))
//   app.get('*', (_, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
//   })
// } else {
//   app.get('/', (_, res) => {
//     res.status(200).json({ message: 'Welcome to the ORTA app API' })
//   })
// }

// Middlewares
app.use(errorHandler)
if(process.env.PORT){
    app.listen(PORT, ()=>{
        console.log(`Server started on ${PORT}`)
    })
}




// Export the Express API
module.exports = app;