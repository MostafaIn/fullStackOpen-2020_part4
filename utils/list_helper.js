/* eslint-disable no-unused-vars */
const dummy = blogs => {
  return 1
}

const totalLikes = list => {
  return list.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = list => {
  return list.find( blog => blog.likes === Math.max(...list.map( bl => bl.likes)))
}

const mostBlogs = list => {
  if (list.length < 1) {
    return null
  }
  const authors = list.reduce( (acc, cur) => {
    acc[cur.author] = ++ acc[cur.author] || 1
    return acc
  },{})

  let blogs = Math.max(...Object.values(authors))
  let author = Object.keys(authors).find( author => authors[author] === blogs)

  return { author, blogs }
}

const mostLikes = list =>{
  if (list.length < 1) {
    return null
  }
  const authors = list.reduce( (acc, cur) => {
    acc[cur.author] = acc[cur.author] + cur.likes || cur.likes
    return acc
  },{})

  let likes = Math.max(...Object.values(authors))
  let author = Object.keys(authors).find( author => authors[author] === likes)

  return { author, likes }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}