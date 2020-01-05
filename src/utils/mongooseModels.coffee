p = require('print-tools-js')
hooks = require('./modelHooks')
mongoose = require('mongoose')
schemaInfo = require('mongoose-auto-api.info')
autoIncrement = require('mongoose-sequence')(mongoose)

#: Generate Model from object

modelGen = (obj) ->

	# Model Gen

	model = new (mongoose.Schema)(
		obj.schema,
		{
			collection: obj.collectionName,
			timestamps: true,
			usePushEach: if obj.listFields.length > 0 then true else false
		}
	)

	# Add List Hook

	if obj.listFields.length > 0
		model.pre(
			'save',
			hooks.listCreate(obj.listFields)
		)

	# Add Encryption Hooks

	if obj.encryptFields.length > 0
		for field in obj.encryptFields
			model.pre(
				'save',
				hooks.saveEncrypt(field)
			)
			model.pre(
				'updateOne',
				hooks.updateEncrypt(field)
			)

	# Add Encoding Hooks

	if obj.encodeFields.length > 0
		for field in obj.encodeFields
			model.pre(
				'save',
				hooks.saveEncode(field)
			)
			model.pre(
				'updateOne',
				hooks.updateEncode(field)
			)

	# Add Sub-Document Hooks

	if obj.subDocFields.length > 0
		for field in obj.subDocFields
			model.pre(
				'save',
				hooks.saveSubDoc(field)
			)
			model.pre(
				'updateOne',
				hooks.updateSubDoc(field)
			)

	# Auto-Increment Plugin

	model.plugin(
		autoIncrement,
		id: "#{obj.collectionName}_uid"
		inc_field: 'uid'
	)

	# Log Model

	p.success(
		"#{obj.moduleName} Model instantiated",
		log: false
	)
	logs = [
		"Module: #{obj.moduleName}"
		"Collection: #{obj.collectionName}"
		"Mongoose Model: #{obj.modelName}"
		"Primary Key: #{obj.primaryKey}"
		"Fields: #{Object.keys(obj.schema).join(', ')}"
	]
	if obj.listFields.length > 0
		logs.push("List fields: #{obj.listFields.join(', ')}")

	if obj.subDocFields.length > 0
		logs.push("Sub-Document fields: #{obj.subDocFields.join(', ')}")

	if obj.encryptFields.length > 0
		logs.push("Encrypted fields: #{obj.encryptFields.join(', ')}")

	if obj.encodeFields.length > 0
		logs.push("Encoded fields: #{obj.encodeFields.join(', ')}")

	for log in logs
		p.bullet(
			log,
			indent: 1
			log: false
		)

	# Mongoose Model and attributes

	return {
		...obj,
		incField: 'uid',
		uidCollection: "#{obj.collectionName}_uid",
		model: mongoose.model(
			obj.modelName,
			model
		),
	}

#: Generate All Models

genAllModels = () ->
	for key, val of schemaInfo
		schemaInfo[key] = modelGen({
			...schemaInfo[key],
			moduleName: key
		})
	return schemaInfo

#: Exports

module.exports = genAllModels()