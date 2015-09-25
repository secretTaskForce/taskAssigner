'use strict';

var app = {};

$(function() { //when DOM is ready...
	app.users = new TaskTrackerModels.Users([
		{username: 'David'},
		{username: 'Molly'},
		{username: 'Stephen'},
	]);

	app.tasks = new TaskTrackerModels.Tasks([
		// {
		// 	title: 'Bathroom',
		// 	description: 'Clean Bathroom',
		// 	creator: 'David',
		// 	status: 'Unassigned',
		// 	assignee: 'Not Assigned'
		// },
		// {
		// 	title: 'Floors',
		// 	description: 'Clean Floors',
		// 	creator: 'David',
		// 	status: 'Unassigned',
		// 	assignee: 'Not Assigned'
		// },
		// {
		// 	title: 'Kitchen',
		// 	description: 'Clean Kitchen',
		// 	creator: 'David',
		// 	status: 'Unassigned',
		// 	assignee: 'Not Assigned'
		// },
	]);

	app.gui = new GUI(app.users, app.tasks, '#app');
});
