var assert, models, should;

assert = require('chai').assert;

should = require('chai').should();

models = require('../index');

// Main import
describe('index', function() {
  it('Returns object', function() {
    return models.should.be.a('object');
  });
  it('User Auth info exists', function() {
    return assert.equal(models.userAuth != null, true);
  });
  it('User Auth "model" key exists', function() {
    return assert.equal(models.userAuth.modelName != null, true);
  });
  it('Secret Key info exists', function() {
    return assert.equal(models.secretKey != null, true);
  });
  return it('Secret Key "model" key exists', function() {
    return assert.equal(models.secretKey.modelName != null, true);
  });
});

//::: End Program :::
