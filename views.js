'use strict';

var GUI = (function() {

  // is either undefined or a specific username
  var userSession;

  // ----------------------------------------------------------------------------
  // Tasks
  // ----------------------------------------------------------------------------

  // single task view
  var TaskView = Backbone.View.extend({
    render: function() {
      var title = '<h3 class="title">' + this.model.get('title') + '</h3>';
      var description = '<p class="description">' + this.model.get('description') + '</p>';
      var creator = '<h5 class="creator">Creator: ' + this.model.get('creator') + '</h5>';

      // assignee drop down
      var assigneeList = $('<select class="assignee-list"></select>');
      var options = '<option>Not Assigned</option>';
      app.users.each(function(model) { // will this work using just users?
        var option = '<option>' + model.get('username') + '</option>';
        options += option;
      }, this);
      assigneeList.html(options);
      assigneeList.val(this.model.get('assignee'));

      // status drop down
      var statusList = $('<select class="status-list"></select>');
      statusList.html('<option>Unassigned</option><option>Assigned</option><option>In Progress</option><option>Done</option>');
      statusList.val(this.model.get('status'));

      this.$el.html(title + description + creator);
      this.$el.append('<h5>Assign Task</h5>');
      this.$el.append(assigneeList);
      this.$el.append('<h5>Set Status</h5>');
      this.$el.append(statusList);
    },
    events : {
      'change .assignee-list': 'assignTask',
      'change .status-list': 'changeStatus'
    },
    assignTask: function(event) {
      this.model.set('assignee', $(event.currentTarget).val());
      if ($(event.currentTarget).val() === 'Not Assigned') {
        this.model.set('status', 'Unassigned');
      } else {
        this.model.set('status', 'Assigned');
      }

    },
    changeStatus: function(event) {
      this.model.set('status', $(event.currentTarget).val());
    },
  });

  // create tasks view - form for adding new tasks
  var CreateTaskView = Backbone.View.extend({
    render: function() {
      var error = '<p class="error"></p>'
      var header = '<h2>Create Task</h2>'
      var title = 'Title <input type="text" id="title-input">';
      var description = 'Description <textarea id="description-input"></textarea>';
      var submit = '<button id="add-task">Add Task</button>';
      var cancel = '<button id="cancel-task">Cancel</button>';
      this.$el.html(header + error + title + description + submit + cancel);
    },
    events : {
      'click #add-task': 'addModel',
      'click #cancel-task': 'clear'
    },
    addModel : function () {
      if ($('#title-input').val() && $('#description-input').val()) {
        this.collection.add({ creator: userSession, title: $('#title-input').val(), description: $('#description-input').val() });
        this.remove();
      } else {
        $('.error').html('Fields cannot be blank');
      }

    },
    clear : function () {
      this.remove();
    }
  });

  // unassigned tasks collection view
  var UnassignedTasksView = Backbone.View.extend({
    render: function() {
      var header = '<h2>Unassigned Tasks</h2>';
      var newTask = '<button id="new-task">New Task</button>';
      this.$el.html(header + newTask);

      // loop through unassigned tasks
      if (this.collection.where('status', 'Unassigned')) {
        this.collection.each(function(task) {
          if (task.get('status') === 'Unassigned') {
            var taskView = new TaskView({ model: task });
            taskView.render();
            this.$el.append(taskView.$el);
          }
        }, this);
      }
    },
    events: {
      'click #new-task': 'newTask'
    },
    initialize : function () {
      this.collection.on('add', this.render, this);
      this.collection.on('change', this.render, this);
    },
    newTask: function() {
      var createTask = new CreateTaskView({ collection: app.tasks });
      createTask.render();
      this.$el.prepend(createTask.$el);
    }
  });

  // users tasks collection view (creator)
  var UsersTasksView = Backbone.View.extend({
    render: function() {
      var header = '<h2>'+ userSession + '\'s Tasks</h2>';
      this.$el.html(header);
      var userTaskExists = this.collection.where({creator: userSession}) || this.collection.where({assignee: userSession});

      // loop through users tasks
      if (userTaskExists) {
        this.collection.each(function(task) {
          if (task.get('creator') === userSession || task.get('assignee') === userSession) {
            var taskView = new TaskView({ model: task });
            console.log(taskView);
            taskView.render();
            this.$el.append(taskView.$el);
          }
        }, this);
      }
    },
    initialize : function () {
      this.collection.on('add', this.render, this);
      this.collection.on('change', this.render, this);
    }
  });


  // ----------------------------------------------------------------------------
  // Users
  // ----------------------------------------------------------------------------

  // user view - signed in user page
  var UserView = Backbone.View.extend({
    render: function() {
      var username = '<h2 class="logout" id="username">' + this.model.get('username') + '</h2>';
      var logout = '<button class="logout" id="button">Logout</button>';
      var unassignedTasks = new UnassignedTasksView({ collection: app.tasks });
      var usersTasks = new UsersTasksView({ collection: app.tasks });
      unassignedTasks.render();
      usersTasks.render();
      this.$el.append(username + logout);
      this.$el.append(unassignedTasks.$el);
      this.$el.append(usersTasks.$el);
    },
    events: {
      'click #logout': 'logout'
    },
    logout: function() {
      var loginView = new LoginView({ collection: app.users });
      loginView.render();
      $('#app').append(loginView.$el)
      this.model.set('currentUser', false);
      userSession = undefined;
      this.remove();
    }
  });

  // users collection view
  var LoginView = Backbone.View.extend({ // was users view
    render: function() {
      var error = '<p class="error"></p>'
      var loginHeader = '<h2 class="text">Log In</h2>';
      var userHeader = '<h4 class="text">Create User</h4>';
      var username = 'Username <input type="text" id="username-input">';
      var submit = '<button id="add-user">Add User</button>';
      var selectHeader = '<h4 class="text">Or Select User</h4>';
      var users = '<select id="user-select"><option>Select User</option>';

      // loop through users and add add as options to select tag
      this.collection.each(function(model) {
        var option = '<option>' + model.get('username') + '</option>';
        users += option;
      });
      users += '</select>';
      this.$el.html(loginHeader + error + userHeader + username + submit + selectHeader + users);
    },
    initialize : function () {
      this.listenTo(this.collection, 'add', this.addUser);
    },
    events : {
      'click #add-user': 'addModel',
      'change #user-select': 'selectUser'
    },
    addModel : function () {
      if ($('#username-input').val() !== '') {
        this.collection.add({});
      } else {
        $('.error').html('Username cannot be blank');
      }
    },
    addUser : function (newModel) {
      var nameOfUser = $('#username-input').val();
      newModel.set('username', nameOfUser);
      newModel.set('currentUser', true);
      userSession = newModel.get('username');
      var userView = new UserView({ model: newModel });
      userView.render();
      $('#app').prepend(userView.$el);
      this.remove();
    },
    selectUser: function() {
      var selectedUser = this.collection.where({ 'username': $('#user-select').val() })[0];
      selectedUser.set('currentUser', true);
      userSession = selectedUser.get('username');
      var userView = new UserView({ model: selectedUser });
      userView.render();
      $('#app').prepend(userView.$el);
      this.remove();
    }
  });

  // ----------------------------------------------------------------------------
  // GUI Constructor
  // ----------------------------------------------------------------------------

  function GUI(users,tasks,el) {

    var loginView = new LoginView({ collection: users });

    loginView.render();

    $('#app').append(loginView.$el);
  }

  return GUI;

})();
