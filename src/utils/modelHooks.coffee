bcrypt = require('bcrypt')
b64Encode = require('nodejs-base64').base64encode

#: Helper Methods

# Encrypt method

encryptField = (rec, key, recType='doc') ->
	SALT_WORK_FACTOR = 10
	if recType == 'doc' and !rec.isModified(key) and !rec.isNew
		return
	try
		salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
		rec[key] = await bcrypt.hash(
			rec[key],
			salt
		)
	catch error
		return {
			message: "Could not #{ if recType is 'doc' then 'create' else 'update' } encrypted field."
			errorMsg: error
		}
	return rec

# Base 64 Encoded Field

encodeField = (rec, key, recType='doc') ->
	if recType == 'doc' and !rec.isModified(key) and !rec.isNew
		return
	try
		rec[key] = b64Encode(rec[key])
	catch error
		return {
			message: "Could not #{ if recType is 'doc' then 'create' else 'update' } encoded field."
			errorMsg: error
		}
	return rec

# Sub-Document Field

subDocField = (rec, key, recType='doc') ->
	if recType == 'doc' and !rec.isModified(key) and !rec.isNew
		return
	try
		if typeof rec[key] == 'string' and rec[key][0] == '{' and rec[key][rec[key].length - 1] == '}'
			rec[key] = JSON.parse(rec[key])
	catch error
		return {
			message: "Could not #{ if recType is 'doc' then 'create' else 'update' } sub-document field."
			errorMsg: error
		}
	return rec

#: Hook Methods

# Pre-Save hook to save CSV lists for array fields

listCreateMethod = (doc, fields) ->
	try
		for field in fields
			if ',' in doc[field][0]
				vals = doc[field][0].split(',')
				doc[field] = []
				for val in vals
					doc[field].push(val)
	catch error
		return Promise.resolve(
			message: 'Could not set array field value.'
			errorMsg: error
		)
	return Promise.resolve(doc)

# Pre-Save hook to encrypt field

saveEncryptMethod = (doc, key) ->
	return await encryptField(doc, key, 'doc')

# Pre-Update hook to encrypt field

updateEncryptMethod = (query, key) ->
	return await encryptField(query, key, 'query')

# Pre-Save hook to encode field

saveEncodeMethod = (doc, key) ->
	return await encodeField(doc, key, 'doc')

# Pre-Update hook to encode field

updateEncodeMethod = (query, key) ->
	return await encodeField(query, key, 'query')

# Pre-Save hook for sub-document field

saveSubDocMethod = (doc, key) ->
	return await subDocField(doc, key, 'doc')

# Pre-Update hook for sub-document field

updateSubDocMethod = (query, key) ->
	return await subDocField(query, key, 'query')

#: Hooks

#: List Create Hook

listCreateHook = (fields) ->
	return(
		-> return await listCreateMethod(
				this,
				fields
			)
	)

#: Save Sub-Document Hook

saveEncryptHook = (key) ->
	return(
		-> return await saveEncryptMethod(
				this,
				key
			)
	)

#: Update Sub-Document Hook

updateEncryptHook = (key) ->
	return(
		-> return await updateEncryptMethod(
				this.getUpdate(),
				key
			)
	)

#: Save Encode Hook

saveEncodeHook = (key) ->
	return(
		-> return await saveEncodeMethod(
				this,
				key
			)
	)

#: Update Encode Hook

updateEncodeHook = (key) ->
	return(
		-> return await updateEncodeMethod(
				this.getUpdate(),
				key
			)
	)

#: Save Sub-Document Hook

saveSubDocHook = (key) ->
	return(
		-> return await saveSubDocMethod(
				this,
				key
			)
	)

#: Update Sub-Document Hook

updateSubDocHook = (key) ->
	return(
		-> return await updateSubDocMethod(
				this.getUpdate(),
				key
			)
	)

#: Exports

module.exports =
	listCreate: listCreateHook
	saveEncrypt: saveEncryptHook
	updateEncrypt: updateEncryptHook
	saveEncode: saveEncodeHook
	updateEncode: updateEncodeHook
	saveSubDoc: saveSubDocHook
	updateSubDoc: saveSubDocHook

#::: End Program :::