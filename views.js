'use strict';

var Views = (function() {

  // ----------------------------------------------------------------------------
  // Users
  // ----------------------------------------------------------------------------

  // single user view
  var UserView = Backbone.View.extend({
    render: function() {
      var username = '<h2>' + this.model.get('username') + '</h2>';
      var logout = '<button id="logout">Logout</button>';
      this.$el.html(username + logout);
    },
    initialize: function() {
      this.model.on('change', this.render, this);
    },
    events: {
      'click #logout': 'logout'
    },
    logout: function() {
      this.model.set('currentUser', false);
      this.remove();
      $('#app').hide();
      $('#login').show();
    }
  });

  // users collection view
  var UsersView = Backbone.View.extend({ // will be login/create user
    render: function() {
      var userHeader = '<h4>Create User</h4>';
      var username = 'Username: <input type="text" id="username-input">';
      var submit = '<button id="add-user">Add User</button>';
      var selectHeader = '<h4>Or Select User</h4>';
      var users = '<select id="user-select"><option>Select User</option>';
  		this.collection.each(function(model) { // not exact needs improvement, how to connect to users
  			var option = '<option>' + model.get('username') + '</option>';
        users += option;
  		});
      users += '</select>';
      this.$el.html(userHeader + username + submit + selectHeader + users);
    },
    initialize : function () {
      this.listenTo(this.collection, 'add', this.addUser);
      this.collection.on('change', this.login, this);
    },
    events : {
      'click #add-user': 'addModel',
      'change #user-select': 'selectUser'
    },
    addModel : function () {
      if ($('#username-input').val() !== '') {
        this.collection.add({});
      } else {
        return console.log('No Username Provided');
      }
    },
    addUser : function (newModel) {
      var nameOfUser = $('#username-input').val();
      newModel.set('username', nameOfUser);
      newModel.set('currentUser', true);
      var view = new UserView({ model: newModel });
      view.render();
      $('#app').prepend(view.$el);
    },
    selectUser: function() {
      var selectedUser = this.collection.where({ 'username': $('#user-select').val() })[0];
      selectedUser.set('currentUser', true);
      selectedUser.createView();
    },
    login: function() {
      this.render();
      $('#login').hide();
      $('#app').show();
    }
  });

  // ----------------------------------------------------------------------------
  // Tasks
  // ----------------------------------------------------------------------------

  // single task view
  var TaskView = Backbone.View.extend({
    render: function() {
  		var title = '<h2 class="title">' + this.model.get('title') + '</h2>';
  		var description = '<p class="description">' + this.model.get('description') + '</p>';
  		this.$el.html(title + description);
  	},
    initialize: function () {
      this.model.on('change', this.render, this);
    }
  });

  // tasks collection view
  var TasksView = Backbone.View.extend({
    render: function() {
      var header = '<h2>Unassigned Tasks</h2>'
      var title = 'Title: <input type="text" id="title-input">';
      var description = 'Description: <input type="text" id="description-input">';
      var submit = '<button id="add-task">Add Task</button>';
      this.$el.html(header + title + description + submit);
    },
    initialize : function () {
      this.listenTo(this.collection, 'add', this.addTask);
    },
    events : {
      'click #add-task': 'addModel'
    },
    addModel : function () {
      if ($('#title-input').val() !== '' && $('#description-input').val() !== '') {
        this.collection.add({});
      } else {
        return console.log('Fields cannot be blank');
      }
    },
    addTask : function (newModel) {
      var taskTitle = $('#title-input').val();
      var taskDescription = $('#description-input').val();
      newModel.set('title', taskTitle);
      newModel.set('description', taskDescription);
      var view = new TaskView({ model: newModel });
      view.render();
      $('#title-input').val('');
      $('#description-input').val('');
      this.$el.append(view.$el);
    }
  });

  // ----------------------------------------------------------------------------
  // Export
  // ----------------------------------------------------------------------------

  var Views = {
    UserView: UserView,
    UsersView: UsersView,
    TaskView: TaskView,
    TasksView: TasksView
  };

  return Views;

})();
