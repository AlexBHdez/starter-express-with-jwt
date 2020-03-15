const express = require('express')

const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Import routes
const authRoute = require('./routes/auth')
const privateRoute = require('./routes/private')

dotenv.config()

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('connected to MongoDB')).catch(error => console.log(error))

// Middlewares
app.use(express.json())

// Routes middlewares
app.use('/api/user', authRoute)
app.use('/api/private', privateRoute)

app.listen(process.env.PORT, () => console.log(`→ Server up and running on port: ${ process.env.PORT } 🤓`))
