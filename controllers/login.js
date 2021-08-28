const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const loginRouter = require('express').Router()

loginRouter.post('/', async (req, res)=>{
  const {username, password} = req.body

  const user = await User.findOne({username})

  const passwordCorrect = !user 
    ? false 
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) return res.status(401).end()

  const userForToken = {
    userId : user._id,
    username: user.username
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  res.send({
    name: user.name, 
    username: user.username,
    token
  })
})

module.exports = loginRouter