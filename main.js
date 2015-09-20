'use strict';
(function() {

	// ----------------------------------------------------------------------------
	// Initialize
	// ----------------------------------------------------------------------------

	var tasks = new Models.Tasks();

	var tasksView = new Views.TasksView({ collection: tasks });

	tasksView.render();

	var users = new Models.Users();

	var usersView = new Views.UsersView({ collection: users });

	usersView.render();

	var usersViewDiv = $('#login').append(usersView.$el);

	var appViewDiv = $('#app').append(tasksView.$el);

	appViewDiv.hide();


})();
