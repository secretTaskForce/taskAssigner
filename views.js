'use strict';

var GUI = (function() {

  // ----------------------------------------------------------------------------
  // Tasks
  // ----------------------------------------------------------------------------

  // single task view
  var TaskView = Backbone.View.extend({
    render: function() {
      var title = '<h2 class="title">' + this.model.get('title') + '</h2>';
      var description = '<p class="description">' + this.model.get('description') + '</p>';
      var creator = '<h5 class="creator">' + this.model.get('creator') + '</h5>';
      var assignee = '<h5 class="assignee">' + this.model.get('assignee') + '</h5>'; // needs to be dropdown
      var status = '<h5 class="status">' + this.model.get('status') + '</h5>'; // needs to be dropdown
      this.$el.html(title + description);
    },
    initialize: function () {
      this.model.on('change', this.render, this);
    }
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
      // what would go here?
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
    }
  });

  // unassigned tasks collection view
  var UnassignedTasksView = Backbone.View.extend({
    // listen to create tasks for an unassigned task and add it to the list
    // have a button to create a createtaskview
    render: function() {
      var newTask = '<button id="new-task">New Task</button>';
      var tasks = this.collection.where('status', 'unassigned');
      var views = []
      tasks.each(function(model) {
        views.push(new TaskView({ model: model}));
        this.$el.append(new TaskView({ model: model}));
      });
      this.$el.append(newTask);
    },
    initialize : function () {
      this.on('change', this.render, this);
      this.collection.on('change', this.render, this); // will this work?
    },
    events : {
      'change #assignee-list': 'assignTask',
      'change #status-list': 'changeStatus',
      'click #new-task': 'newTask'
    },
    assignTask: function() {
      this.model.set('assignee', $('#assignee-list').val());
    },
    changeStatus: function() {
      this.model.set('status', $('#status-list').val());
    },
    newTask: function() {
      var createTask = new CreateTaskView();
      createTask.render();
      this.$el.append(createTask.$el);
    }
  });

  // users tasks collection view
  var UsersTasksView = Backbone.View.extend({

  });

  // ----------------------------------------------------------------------------
  // Users
  // ----------------------------------------------------------------------------

  // single user view
  var UserView = Backbone.View.extend({

  });

  // users collection view
  var LoginView = Backbone.View.extend({ // was users view

  });

  // ----------------------------------------------------------------------------
  // Constructor
  // ----------------------------------------------------------------------------

  function GUI(users,tasks,el) {
  	// users is collection of User models
  	// tasks is collection of Task models
  	// el is selector for where GUI connects in DOM

  	//...
  }

  return GUI;

})();
