'use strict';

var app = {};

$(function() { //when DOM is ready...
	app.users = new TaskTrackerModels.Users([
		{username: 'David'},
		{username: 'Molly'},
		{username: 'Stephen'},
	]);

	app.tasks= new TaskTrackerModels.Tasks([
		{
			title: 'Insurrection',
			description: 'Start an insurrection',
			creator: 'David',
			status: 'Unassigned',
			assignee: 'Not Assigned'
		},
		{
			title: 'General Strike',
			description: 'Facilitate a general strike',
			creator: 'Molly',
			status: 'Unassigned',
			assignee: 'Not Assigned'
		},
		{
			title: 'Abolish Capitalism',
			description: 'Also abolish the state',
			creator: 'Stephen',
			status: 'Unassigned',
			assignee: 'Not Assigned'
		},
	]);

	app.gui = new GUI(app.users, app.tasks, '#app');
});
