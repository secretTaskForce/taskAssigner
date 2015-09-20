'use strict';

var Models = (function() {

  // ----------------------------------------------------------------------------
  // Users
  // ----------------------------------------------------------------------------

  var User = Backbone.Model.extend({
  	defaults: {
  		username: '',
      currentUser: false
  	},
    createView: function() {
      var view = new UserView({model: this});
      view.render();
      $('#app').prepend(view.$el);
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
  		description: ''
  	}
  });

  var Tasks = Backbone.Collection.extend({
  	model: Task
  });

  // ----------------------------------------------------------------------------
  // Export
  // ----------------------------------------------------------------------------

  var Models = {
    User: User,
    Users: Users,
    Task: Task,
    Tasks: Tasks
  };

  return Models;

})();
