assert = require('chai').assert
should = require('chai').should()
info = require('../index')

# Main import

describe 'index', ->
	it 'Returns object', ->
		info.should.be.a('object')
	it 'User Auth info exists', ->
		assert.equal(info.userAuth?, true)
	it 'User Auth "model" key exists', ->
		assert.equal(info.userAuth.modelName?, true)
	it 'Secret Key info exists', ->
		assert.equal(info.secretKey?, true)
	it 'Secret Key "model" key exists', ->
		assert.equal(info.secretKey.modelName?, true)

#::: End Program :::