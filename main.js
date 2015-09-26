'use strict';

var app = {};

$(function() { //when DOM is ready...
	app.users = new TaskTrackerModels.Users();

	app.tasks= new TaskTrackerModels.Tasks();

	app.gui = new GUI(app.users, app.tasks, '#app');
});
