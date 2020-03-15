const router = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation } = require('../utils/validation')

router.post('/register', async (req, res) => {
  // Validate the data with joiSchema
  const { error } = registerValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // Check if the user is already in the db
  const { name, email, password } = req.body
  const emailExist = await User.findOne({ email })
  if (emailExist) return res.status(400).send('Email already exists')

  // Hash the password
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)

  const user = new User({
    name,
    email,
    password: hashPassword
  })

  try {
    const savedUser = await user.save()
    res.send({ user: savedUser._id })
  } catch(err) {
    res.status(400).send(err)
  }
})

router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  // Check if the user is already in the db
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).send('Email or password is wrong')
  // Password is correct
  const validPass = await bcrypt.compare(password, user.password)
  if (!validPass) return res.status(400).send('Invalid password')

  // Create and assign a token
  const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET)
  res.header('auth-token', token).send(token)
})

module.exports = router
