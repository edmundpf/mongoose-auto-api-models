var b64Encode, bcrypt, encodeField, encryptField, listCreateHook, listCreateMethod, saveEncodeHook, saveEncodeMethod, saveEncryptHook, saveEncryptMethod, saveSubDocHook, saveSubDocMethod, subDocField, updateEncodeHook, updateEncodeMethod, updateEncryptHook, updateEncryptMethod, updateSubDocHook, updateSubDocMethod,
  indexOf = [].indexOf;

bcrypt = require('bcrypt');

b64Encode = require('nodejs-base64').base64encode;

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

// Base 64 Encoded Field
encodeField = function(rec, key, recType = 'doc') {
  var error;
  if (recType === 'doc' && !rec.isModified(key) && !rec.isNew) {
    return;
  }
  try {
    rec[key] = b64Encode(rec[key]);
  } catch (error1) {
    error = error1;
    return {
      message: `Could not ${(recType === 'doc' ? 'create' : 'update')} encoded field.`,
      errorMsg: error
    };
  }
  return rec;
};

// Sub-Document Field
subDocField = function(rec, key, recType = 'doc') {
  var error;
  if (recType === 'doc' && !rec.isModified(key) && !rec.isNew) {
    return;
  }
  try {
    if (typeof rec[key] === 'string' && rec[key][0] === '{' && rec[key][rec[key].length - 1] === '}') {
      rec[key] = JSON.parse(rec[key]);
    }
  } catch (error1) {
    error = error1;
    return {
      message: `Could not ${(recType === 'doc' ? 'create' : 'update')} sub-document field.`,
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
      if (indexOf.call(doc[field][0], ',') >= 0) {
        vals = doc[field][0].split(',');
        doc[field] = [];
        for (j = 0, len1 = vals.length; j < len1; j++) {
          val = vals[j];
          doc[field].push(val);
        }
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

// Pre-Save hook to encode field
saveEncodeMethod = async function(doc, key) {
  return (await encodeField(doc, key, 'doc'));
};

// Pre-Update hook to encode field
updateEncodeMethod = async function(query, key) {
  return (await encodeField(query, key, 'query'));
};

// Pre-Save hook for sub-document field
saveSubDocMethod = async function(doc, key) {
  return (await subDocField(doc, key, 'doc'));
};

// Pre-Update hook for sub-document field
updateSubDocMethod = async function(query, key) {
  return (await subDocField(query, key, 'query'));
};

//: Hooks

//: List Create Hook
listCreateHook = function(fields) {
  return (async function() {
    return (await listCreateMethod(this, fields));
  });
};

//: Save Sub-Document Hook
saveEncryptHook = function(key) {
  return (async function() {
    return (await saveEncryptMethod(this, key));
  });
};

//: Update Sub-Document Hook
updateEncryptHook = function(key) {
  return (async function() {
    return (await updateEncryptMethod(this.getUpdate(), key));
  });
};

//: Save Encode Hook
saveEncodeHook = function(key) {
  return (async function() {
    return (await saveEncodeMethod(this, key));
  });
};

//: Update Encode Hook
updateEncodeHook = function(key) {
  return (async function() {
    return (await updateEncodeMethod(this.getUpdate(), key));
  });
};

//: Save Sub-Document Hook
saveSubDocHook = function(key) {
  return (async function() {
    return (await saveSubDocMethod(this, key));
  });
};

//: Update Sub-Document Hook
updateSubDocHook = function(key) {
  return (async function() {
    return (await updateSubDocMethod(this.getUpdate(), key));
  });
};

//: Exports
module.exports = {
  listCreate: listCreateHook,
  saveEncrypt: saveEncryptHook,
  updateEncrypt: updateEncryptHook,
  saveEncode: saveEncodeHook,
  updateEncode: updateEncodeHook,
  saveSubDoc: saveSubDocHook,
  updateSubDoc: saveSubDocHook
};

//::: End Program :::
