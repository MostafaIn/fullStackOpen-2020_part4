/* eslint-disable no-unused-vars */
const dummy = blogs => {
  return 1
}

const totalLikes = list => {
  return list.reduce((sum, blog) => sum + blog.likes, 0)
}

module.exports = {
  dummy,
  totalLikes
}