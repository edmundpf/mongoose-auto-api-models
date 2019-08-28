var assert, info, should;

assert = require('chai').assert;

should = require('chai').should();

info = require('../index');

// Main import
describe('index', function() {
  it('Returns object', function() {
    return info.should.be.a('object');
  });
  it('User Auth info exists', function() {
    return assert.equal(info.userAuth != null, true);
  });
  it('User Auth "model" key exists', function() {
    return assert.equal(info.userAuth.modelName != null, true);
  });
  it('Secret Key info exists', function() {
    return assert.equal(info.secretKey != null, true);
  });
  return it('Secret Key "model" key exists', function() {
    return assert.equal(info.secretKey.modelName != null, true);
  });
});

//::: End Program :::
