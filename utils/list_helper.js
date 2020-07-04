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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}