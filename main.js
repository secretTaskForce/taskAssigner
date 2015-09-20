'use strict';
(function() {

	// ----------------------------------------------------------------------------
	// Initialize
	// ----------------------------------------------------------------------------

	var tasks = new models.Tasks();

	var tasksView = new views.TasksView({ collection: tasks });

	tasksView.render();

	var users = new models.Users();

	var usersView = new views.UsersView({ collection: users });

	usersView.render();

	var usersViewDiv = $('#users-view').append(usersView.$el);

	var appViewDiv = $('#app').append(tasksView.$el);

	appViewDiv.hide();


})();
