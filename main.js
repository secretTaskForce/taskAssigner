'use strict';
(function() {

	// ----------------------------------------------------------------------------
	// Initialize
	// ----------------------------------------------------------------------------

	var tasks = new Tasks();

	var tasksView = new TasksView({ collection: tasks });

	tasksView.render();

	var users = new Users();

	var usersView = new UsersView({ collection: users });

	usersView.render();

	var usersViewDiv = $('#users-view').append(usersView.$el);

	var appViewDiv = $('#app').append(tasksView.$el);

	appViewDiv.hide();


})();
