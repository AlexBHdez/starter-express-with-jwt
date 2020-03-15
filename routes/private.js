const router = require('express').Router()
const verify = require('../middlewares/verifyToken')

router.get('/', verify, (req, res) => {
  const { user } = req
  res.json({
    data: {
      user,
      title: 'Private route',
      description: 'This is a private route with json web token'
    },
  })
})

module.exports = router
