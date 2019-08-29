assert = require('chai').assert
should = require('chai').should()
models = require('../index')

# Main import

describe 'index', ->
	it 'Returns object', ->
		models.should.be.a('object')
	it 'User Auth info exists', ->
		assert.equal(models.userAuth?, true)
	it 'User Auth "model" key exists', ->
		assert.equal(models.userAuth.modelName?, true)
	it 'Secret Key info exists', ->
		assert.equal(models.secretKey?, true)
	it 'Secret Key "model" key exists', ->
		assert.equal(models.secretKey.modelName?, true)

#::: End Program :::