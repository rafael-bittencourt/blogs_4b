const Blog = require('../models/blog')

const initialBlogs = [
	{
		title: 'Test 1',
		author: 'Author 1',
		url: 'www.url1.com',
		likes: 0
	},
	{
		title: 'Test 2',
		author: 'Author 2',
		url: 'www.url2.com',
		likes: 10
	},
]

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

module.exports = {
	initialBlogs, blogsInDb
}