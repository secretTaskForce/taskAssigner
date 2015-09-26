'use strict';

var TaskTrackerModels = (function() {

  // ----------------------------------------------------------------------------
  // Users
  // ----------------------------------------------------------------------------

  var User = Backbone.Model.extend({
  	defaults: {
  		username: '',
      currentUser: false
    }
  });

  var Users = Backbone.Collection.extend({
  	model: User
  });

  // ----------------------------------------------------------------------------
  // Tasks
  // ----------------------------------------------------------------------------

  var Task = Backbone.Model.extend({
  	defaults: {
  		title: '',
  		description: '',
      creator: '',
      assignee: 'Not Assigned',
      status: 'Unassigned'
  	}
  });

  var Tasks = Backbone.Collection.extend({
  	model: Task
  });

  // ----------------------------------------------------------------------------
  // Module
  // ----------------------------------------------------------------------------

  return {
    Users: Users,
    Tasks: Tasks
  };

})();
