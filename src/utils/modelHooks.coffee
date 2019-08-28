bcrypt = require('bcrypt')

#: Helper Methods

# Encrypt method

encryptField = (rec, key, recType='doc') ->
	SALT_WORK_FACTOR = 10
	if recType='doc' and !doc.isModified(key) and !doc.isNew
		return
	try
		salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
		doc[key] = await bcrypt.hash(
			doc[key],
			salt
		)
	catch error
		return {
			message: "Could not #{ if recType is 'doc' then 'create' else 'update' } encrypted field."
			errorMsg: error
		}
	return doc

#: Hook Methods

# Pre-Save hook to save CSV lists for array fields

listCreateMethod = (doc, fields) ->
	try
		for field in fields
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
	return await encryptField(query, key, 'doc')

#: Hooks

#: List Create Hook

listCreateHook = (fields) ->
	return(
		-> return await listCreateMethod(
				this,
				fields
			)
	)

#: Save Encrypt Hook

saveEncryptHook = (key) ->
	return(
		-> return await saveEncryptMethod(
				this,
				key
			)
	)

#: Update Encrypt Hook

updateEncryptHook = (key) ->
	return(
		-> return await updateEncryptMethod(
				this.getUpdate(),
				key
			)
	)

#: Exports

module.exports =
	listCreate: listCreateHook
	saveEncrypt: saveEncryptHook
	updateEncrypt: updateEncryptHook

#::: End Program :::