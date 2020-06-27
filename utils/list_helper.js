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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}