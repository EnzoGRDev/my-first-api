module.exports = (req, res, next) =>{
  const {title, content, important} = req.body

  if (typeof(title === 'string')) ""
  else delete req.body.title
  
  if (typeof(content === 'string')) ""
  else delete req.body.content 

  if (important === false || important === true) ""
  else delete req.body.important

  next()
} 