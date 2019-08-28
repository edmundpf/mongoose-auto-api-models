var autoIncrement, genAllModels, hooks, modelGen, mongoose, p, schemaInfo;

p = require('print-tools-js');

hooks = require('./modelHooks');

mongoose = require('mongoose');

schemaInfo = require('mongoose-auto-api.info');

autoIncrement = require('mongoose-sequence')(mongoose);

//: Generate Model from object
modelGen = function(obj) {
  var field, i, j, len, len1, log, logs, model, ref;
  // Model Gen
  model = new mongoose.Schema(obj.schema, {
    collection: obj.collectionName,
    timestamps: true,
    usePushEach: obj.listFields.length > 0 ? true : false
  });
  // Add List Hook
  if (obj.listFields.length > 0) {
    model.pre('save', hooks.listCreate(obj.listFields));
  }
  // Add Encryption Hooks
  if (obj.encryptFields.length > 0) {
    ref = obj.encryptFields;
    for (i = 0, len = ref.length; i < len; i++) {
      field = ref[i];
      model.pre('save', hooks.saveEncrypt(field));
      model.pre('updateOne', hooks.updateEncrypt(field));
    }
  }
  // Auto-Increment Plugin
  model.plugin(autoIncrement, {
    id: `${obj.collectionName}_uid`,
    inc_field: 'uid'
  });
  // Log Model
  p.success(`${obj.moduleName} Model instantiated`, {
    log: false
  });
  logs = [`Module: ${obj.moduleName}`, `Collection: ${obj.collectionName}`, `Mongoose Model: ${obj.modelName}`, `Primary Key: ${obj.primaryKey}`, `Fields: ${Object.keys(obj.schema).join(', ')}`];
  if (obj.listFields.length > 0) {
    logs.push(`List fields: ${obj.listFields.join(', ')}`);
  }
  if (obj.encryptFields.length > 0) {
    logs.push(`Encrypted fields: ${obj.encryptFields.join(', ')}`);
  }
  for (j = 0, len1 = logs.length; j < len1; j++) {
    log = logs[j];
    p.bullet(log, {
      indent: 1,
      log: false
    });
  }
  return {
    // Mongoose Model and attributes
    ...obj,
    incField: 'uid',
    uidCollection: `${obj.collectionName}_uid`,
    model: mongoose.model(obj.modelName, model)
  };
};

//: Generate All Models
genAllModels = function() {
  var key, val;
  for (key in schemaInfo) {
    val = schemaInfo[key];
    schemaInfo[key] = modelGen({
      ...schemaInfo[key],
      moduleName: key
    });
  }
  return schemaInfo;
};

//: Exports
module.exports = genAllModels();
