var bcrypt, encryptField, listCreateHook, listCreateMethod, saveEncryptHook, saveEncryptMethod, updateEncryptHook, updateEncryptMethod;

bcrypt = require('bcrypt');

//: Helper Methods

// Encrypt method
encryptField = async function(rec, key, recType = 'doc') {
  var SALT_WORK_FACTOR, error, salt;
  SALT_WORK_FACTOR = 10;
  if (recType === 'doc' && !rec.isModified(key) && !rec.isNew) {
    return;
  }
  try {
    salt = (await bcrypt.genSalt(SALT_WORK_FACTOR));
    rec[key] = (await bcrypt.hash(rec[key], salt));
  } catch (error1) {
    error = error1;
    return {
      message: `Could not ${(recType === 'doc' ? 'create' : 'update')} encrypted field.`,
      errorMsg: error
    };
  }
  return rec;
};

//: Hook Methods

// Pre-Save hook to save CSV lists for array fields
listCreateMethod = function(doc, fields) {
  var error, field, i, j, len, len1, val, vals;
  try {
    for (i = 0, len = fields.length; i < len; i++) {
      field = fields[i];
      vals = doc[field][0].split(',');
      doc[field] = [];
      for (j = 0, len1 = vals.length; j < len1; j++) {
        val = vals[j];
        doc[field].push(val);
      }
    }
  } catch (error1) {
    error = error1;
    return Promise.resolve({
      message: 'Could not set array field value.',
      errorMsg: error
    });
  }
  return Promise.resolve(doc);
};

// Pre-Save hook to encrypt field
saveEncryptMethod = async function(doc, key) {
  return (await encryptField(doc, key, 'doc'));
};

// Pre-Update hook to encrypt field
updateEncryptMethod = async function(query, key) {
  return (await encryptField(query, key, 'query'));
};

//: Hooks

//: List Create Hook
listCreateHook = function(fields) {
  return (async function() {
    return (await listCreateMethod(this, fields));
  });
};

//: Save Encrypt Hook
saveEncryptHook = function(key) {
  return (async function() {
    return (await saveEncryptMethod(this, key));
  });
};

//: Update Encrypt Hook
updateEncryptHook = function(key) {
  return (async function() {
    return (await updateEncryptMethod(this.getUpdate(), key));
  });
};

//: Exports
module.exports = {
  listCreate: listCreateHook,
  saveEncrypt: saveEncryptHook,
  updateEncrypt: updateEncryptHook
};

//::: End Program :::
