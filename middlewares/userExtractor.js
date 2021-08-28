const jwt = require('jsonwebtoken')

module.exports = async (req,res, next)=>{
  const authorization = req.get('authorization')
  let token = null
  if (authorization && authorization.toLowerCase().startsWith('bearer')){
    token = authorization.substring(7)
  }

  // const tokenDecoded = await jwt.verify(token, process.env.SECRET)

  let tokenDecoded = null

  try {
    tokenDecoded = jwt.verify(token, process.env.SECRET)
  }
  catch(err){
    return res.status(401).end()
  }

  if (!token || !tokenDecoded) return res.status(401).end()

  const {userId} = tokenDecoded

  req.userId = userId

  next()
}