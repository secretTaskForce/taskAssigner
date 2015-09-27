'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname));

var database = {};

database.users = [
  {username: 'Shadow Dragon', id: 0},
  {username: 'Dash', id: 1},
  {username: 'Green Lantern', id: 2}
];

database.tasks = [
  {
    title: 'Insurrection',
    description: 'Start an insurrection',
    creator: 'Shadow Dragon',
    status: 'Unassigned',
    assignee: 'Not Assigned',
    id: 0
  },
  {
    title: 'Specific strike',
    description: 'Strike fear into the hearts of enemys',
    creator: 'Dash',
    status: 'Assigned',
    assignee: 'Dash',
    id: 1
  },
  {
    title: 'General Strike',
    description: 'Facilitate a general strike',
    creator: 'Dash',
    status: 'Unassigned',
    assignee: 'Not Assigned',
    id: 2
  },
  {
    title: 'Abolish Capitalism',
    description: 'Also abolish the state',
    creator: 'Green Lantern',
    status: 'Unassigned',
    assignee: 'Not Assigned',
    id: 3
  }
];

function showData(collname) {
	console.log(collname+' data store is now: ', database[collname]);
}

function getOne(collname) {
	app.get('/'+collname+'/:id', function (req, res) {
		var id = req.params.id;
		console.log('Sending model #%s...',id);
		res.send(database[collname][id]);
	});
}

function putOne(collname) {
	app.put('/'+collname+'/:id', function (req, res) {
		var id = req.params.id;
		console.log('Receiving model #%s...',id);
		database[collname][id] = req.body;
		showData(collname);
		res.send({});
	});
}

function postOne(collname) {
	app.post('/'+collname, function (req, res) {
		console.log('Receiving new model...');
		var newid = collname.length;
		console.log('Assigning id of %s',newid);
		var obj = req.body;
		obj.id = newid;
		database[collname][newid] = obj;
		showData(collname);
		res.send(obj);
	});
}

function getAll(collname) {
	app.get('/'+collname, function (req, res) {
		console.log('Sending all models...');
		showData(collname);
		res.send(database[collname]);
	});
}

function makeRoutes(collname) {
	getOne(collname);
	postOne(collname);
	putOne(collname);
	getAll(collname);
}

Object.keys(database).forEach(makeRoutes);

app.listen(3000);
Object.keys(database).forEach(showData);
