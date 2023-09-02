const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')


beforeEach(async () => {
	await Blog.deleteMany({})

	const blogObjects = helper.initialBlogs
		.map(note => new Blog(note))
	const promiseArray = blogObjects.map(blog => blog.save())
	await Promise.all(promiseArray)
})

describe('properties', () => {
	test('id is defined', async () => {
		const response = await api.get('/api/blogs')
		expect(response.body[0].id).toBeDefined()
	})
})

describe('getters', () => {
	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('all blogs are returned', async () => {
		const response = await api.get('/api/blogs')

		expect(response.body).toHaveLength(helper.initialBlogs.length)
	})

	test('a specific blog is within the returned blogs', async () => {
		const response = await api.get('/api/blogs')

		const titles = response.body.map(r => r.title)
		expect(titles).toContain(
			'Test 2'
		)
	})
})

describe('insertion of a blog', () => {
	test('a valid blog can be added', async () => {
		const newBlog = {
			title: 'Blog 3',
			author: 'Author 3',
			url: 'URL 3',
			likes: 3
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

		const titles = blogsAtEnd.map(b => b.title)
		expect(titles).toContain(
			'Blog 3'
		)
	})

	test('likes default value is set to 0', async () => {
		const newBlog = {
			title: 'Blog 4',
			author: 'Author 4',
			url: 'URL 4'
		}

		await api
			.post('/api/blogs')
			.send(newBlog)

		const blogsAtEnd = await helper.blogsInDb()
		const testedBlog = blogsAtEnd.find(blog => blog.title === 'Blog 4')
		expect(testedBlog.likes).toEqual(0)
	})

	test('title or url are missing', async () => {
		const newBlog = {
			title: 'Blog 4',
			author: 'Author 4',
			likes: 10
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400)
	})
})
describe('deletion of a blog', () => {
	test('succeeds with status code 204 if id is valid', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204)

		const blogsAtEnd = await helper.blogsInDb()

		expect(blogsAtEnd).toHaveLength(
			helper.initialBlogs.length - 1
		)

		const titles = blogsAtEnd.map(r => r.title)

		expect(titles).not.toContain(blogToDelete.contents)
	})
})

describe('update of a blog', () => {
	test('a blog can be updated', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]
		const update = { title: blogToUpdate.title, author: blogToUpdate.author, url: blogToUpdate.url, likes: 12 }

		const updatedBlog = await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(update)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(updatedBlog.body.likes).toEqual(12)
	})
})


afterAll(async () => {
	await mongoose.connection.close()
})