'use strict';

var app = {};

$(function() { //when DOM is ready...
	app.users = new TaskTrackerModels.Users([
		{username:'David'},
		{username:'Molly'},
		{username:'Stephen'}
	]);

	app.tasks = new TaskTrackerModels.Tasks([
		// test data here
	]);

	app.gui = new GUI(app.users,
		app.tasks,
		'#app');// selector of main div
});

(function() {
