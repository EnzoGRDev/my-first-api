const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', (req, res)=>{
  User.find({})
  .populate('notes', {
    title: 1,
    content: 1,
    date: 1,
  })
    .then(resUsers =>{
      res.json(resUsers)
    })
      .catch(err => {
      console.log(err)
      res.status(503).end()
      })
})

usersRouter.post('/', async (req, res)=>{
  const {username, name, password} = req.body
  
  const isUser = await User.findOne({username})
  if (isUser) return res.status(401).end()
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })
  
  user.save()
    .then(resUser =>{
      res.json(resUser)
      res.status(201).end()
    } )
    .catch(err => {
      console.log(err)
      res.end()
    })
})

module.exports = usersRouter