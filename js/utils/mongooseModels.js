var autoIncrement, genAllModels, hooks, modelGen, mongoose, p, schemaInfo;

p = require('print-tools-js');

hooks = require('./modelHooks');

mongoose = require('mongoose');

schemaInfo = require('mongoose-auto-api.info');

autoIncrement = require('mongoose-sequence')(mongoose);

//: Generate Model from object
modelGen = function(obj) {
  var field, i, j, k, l, len, len1, len2, len3, log, logs, model, ref, ref1, ref2;
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
  // Add Encoding Hooks
  if (obj.encodeFields.length > 0) {
    ref1 = obj.encodeFields;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      field = ref1[j];
      model.pre('save', hooks.saveEncode(field));
      model.pre('updateOne', hooks.updateEncode(field));
    }
  }
  // Add Sub-Document Hooks
  if (obj.subDocFields.length > 0) {
    ref2 = obj.subDocFields;
    for (k = 0, len2 = ref2.length; k < len2; k++) {
      field = ref2[k];
      model.pre('save', hooks.saveSubDoc(field));
      model.pre('updateOne', hooks.updateSubDoc(field));
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
  if (obj.subDocFields.length > 0) {
    logs.push(`Sub-Document fields: ${obj.subDocFields.join(', ')}`);
  }
  if (obj.encryptFields.length > 0) {
    logs.push(`Encrypted fields: ${obj.encryptFields.join(', ')}`);
  }
  if (obj.encodeFields.length > 0) {
    logs.push(`Encoded fields: ${obj.encodeFields.join(', ')}`);
  }
  for (l = 0, len3 = logs.length; l < len3; l++) {
    log = logs[l];
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
