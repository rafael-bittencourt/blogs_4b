const _ = require('lodash')

const dummy = () => {
	return 1
}

const totalLikes = array => array.reduce( (sum, item) => {
	return sum + item.likes
}, 0)

const favoriteBlog = array => array.reduce((mostLiked, blog) => (mostLiked.likes > blog.likes ? mostLiked : blog))

const mostBlogs = (blogs) => {
	if (blogs.length === 0) {
		return 'Blog list is empty'
	}

	const topAuthor = _.chain(blogs)
		.groupBy('author')
		.map((group, author) => {
			return { author: author, blogs: group.length }
		})
		.maxBy((object) => object.blogs)
		.value()

	return topAuthor
}

const mostLikes = (blogs) => {
	if (blogs.length === 0) {
		return 'Blog list is empty'
	}

	const topAuthor = _.chain(blogs)
		.groupBy('author')
		.map((group, author) => {
			return {
				author: author,
				likes: group.reduce((acc, next) => {
					return (acc += next.likes)
				}, 0),
			}
		})
		.maxBy((object) => object.likes)
		.value()

	return topAuthor
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}
