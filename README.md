# Mongoose Auto API - Models Module
[![Build Status](https://travis-ci.org/edmundpf/mongoose-auto-api-models.svg?branch=master)](https://travis-ci.org/edmundpf/mongoose-auto-api-models)
[![npm version](https://badge.fury.io/js/mongoose-auto-api.models.svg)](https://badge.fury.io/js/mongoose-auto-api.models)
> Automatic Mongoose REST API - Module to generate models ☕

## Install
* `npm i -S mongoose-auto-api.models`

## Model Setup
* [Model Setup - mongoose-auto-api.info](https://github.com/edmundpf/mongoose-auto-api-info/blob/master/README.md#model-setup)
* Returns object
	* modelName (String)
	* collectionName (String)
	* primaryKey (String)
	* allFields (Array)
	* listFields (Array)
	* encryptFields (Array)
	* encodeFields (Array)
	* schema (Object)
	* incField (String)
		* incrementing UID field
	* uidCollection (String)
		* UID increment collection
	* model (Object)
		* Mongoose model

## Usage
``` javascript
models = require('mongoose-auto-api.models')
```
