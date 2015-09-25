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

      
      var creator = '<h5 class="creator">' + this.model.get('creator') + '</h5>';
      
      var assignee = '<select id="assignee-list"><option>Not Assigned</option>';
      app.users.each(function(model) { // will this work using just users?
        var option = '<option>' + model.get('username') + '</option>';
        assignee += option;
      });
      assignee += '</select>';
      // var assigneeValue = $("#assignee-list").val();
      // console.log(assigneeValue);
      assignee.val(this.model.get(assignee)); // this props wont work on a string, so figure it out
      console.log(assignee);

      var status = '<select id="status-list"><option>Unassigned</option><option>Assigned</option><option>In Progress</option><option>Done</option></select>';
      // status.val(this.model.get('status')); // this props wont work on a string, so figure it out


      this.$el.html('Title:' + title + 'Description: ' + description + 'Assignee: ' + assignee + 'Status: ' + status);
    },
    initialize: function () {
      this.model.on('change', this.render, this);
    },
    events : { // how to connect to individual task view
      'change #assignee-list': 'assignTask',
      'click #status-list': 'changeStatus'
    },
    assignTask: function() {
      this.model.assignTask();
    },
    changeStatus: function() {
      this.model.changeStatus();
    },
  });

  // tasks collection view
  var CreateTaskView = Backbone.View.extend({ // was tasks view
    render: function() {
      var header = '<h2>Create Task</h2>'
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

      // if ($('#title-input').val() !== '' && $('#description-input').val() !== '') {
        this.collection.add({ creator: userSession });
      // } else {
        // return console.log('Fields cannot be blank');
      // }
    },
    addTask : function (newModel) {
      newModel.set('title', $('#title-input').val());
      newModel.set('description', $('#description-input').val());
      newModel.set('creator', userSession);
      this.remove();
    }
  });

  // unassigned tasks collection view
  var UnassignedTasksView = Backbone.View.extend({
    render: function() {
      var header = '<h2>Unassigned Tasks</h2>';
      var newTask = '<button id="new-task">New Task</button>';
      if (this.collection.where('status', 'Unassigned')) {
        // var unassignedTasks = this.collection.where({status: 'Unassigned'});
        // console.log(unassignedTasks);
        // unassignedTasks.each(function(model) {
        //   var taskView = new TaskView({ model: model });
        //   taskView.render();
        //   this.$el.append(taskView.$el);
        // }, this);
        this.collection.each(function(task) {
          if (task.get('status') === 'Unassigned') {
            var taskView = new TaskView({ model: task });
            taskView.render();
            this.$el.append(taskView.$el);
          }
        }, this);
      }
      this.$el.prepend(header + newTask);
    },
    events: {
      'click #new-task': 'newTask'
    },
    initialize : function () {
      this.collection.on('change', this.render, this);
    },
    newTask: function() {
      var createTask = new CreateTaskView({ collection: app.tasks });
      createTask.render();
      this.$el.append(createTask.$el);
    }
  });

  // users tasks collection view
  var UsersTasksView = Backbone.View.extend({
    render: function() {
      var header = '<h2>Users Tasks</h2>';
      var userTaskExists = this.collection.where('creator', userSession) || this.collection.where('assignee', userSession);
      console.log(userTaskExists);
      if (userTaskExists) {
        // var userTasks = this.collection.where('creator', userSession) + this.collection.where('assignee', userSession);
        // for (var i = 0; i < userTasks.length; i++) {
        //   var model = userTasks[i];
        //   var taskView = new TaskView({ model: model });
        //   taskView.render();
        //   this.$el.append(taskView.$el);
        // }
        this.collection.each(function(task) {
          if (task.get('creator') === userSession) {
            var taskView = new TaskView({ model: task });
            console.log(taskView);
            taskView.render();
            this.$el.append(taskView.$el);
          }
          if (task.get('assignee') === userSession) {
            var taskView = new TaskView({ model: task });
            console.log(taskView);
            taskView.render();
            this.$el.append(taskView.$el);
          }
        }, this);
      }
      this.$el.prepend(header);
    },
    initialize : function () {
      this.on('change', this.render, this);
      this.collection.on('change', this.render, this); // will this work?
    }
  });

  // ----------------------------------------------------------------------------
  // Users
  // ----------------------------------------------------------------------------

  // single user view
  var UserView = Backbone.View.extend({
    render: function() {
      var username = '<h2>' + this.model.get('username') + '</h2>';
      var logout = '<button id="logout">Logout</button>';
      var unassignedTasks = new UnassignedTasksView({ collection: app.tasks });
      var usersTasks = new UsersTasksView({ collection: app.tasks });
      unassignedTasks.render();
      usersTasks.render();
      this.$el.append(username + logout);
      this.$el.append(unassignedTasks.$el);
      this.$el.append(usersTasks.$el);
    },
    initialize: function() {
      this.model.on('change', this.render, this);
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
      var userHeader = '<h4>Create User</h4>';
      var username = 'Username: <input type="text" id="username-input">';
      var submit = '<button id="add-user">Add User</button>';
      var selectHeader = '<h4>Or Select User</h4>';
      var users = '<select id="user-select"><option>Select User</option>';
      this.collection.each(function(model) {
        var option = '<option>' + model.get('username') + '</option>';
        users += option;
      });
      users += '</select>';
      this.$el.html(userHeader + username + submit + selectHeader + users);
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
        return console.log('No Username Provided');
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
