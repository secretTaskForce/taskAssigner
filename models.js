'use strict';

var TaskTrackerModels = (function() {

  // ----------------------------------------------------------------------------
  // Users
  // ----------------------------------------------------------------------------

  var User = Backbone.Model.extend({
  	defaults: {
  		username: '',
      currentUser: false
  	},
    validate: function(attrs, options) {
      if (!attrs.username) {
        return 'Username must be present';
      }
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
  	},
    validate: function(attrs, options) {
      if (!attrs.title || !attrs.description) {
        return 'Fields cannot be blank';
      }
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
