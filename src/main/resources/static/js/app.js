/*global ko, Router */
(function () {
	'use strict';

	var Todo = function (title, completed, id) {
        this.id = ko.observable(id);
        this.id.subscribe(Storage.save.bind(this));
        this.title = ko.observable(title);
        this.title.subscribe(Storage.save.bind(this));
		this.completed = ko.observable(completed);
        this.completed.subscribe(Storage.save.bind(this));
		this.editing = ko.observable(false);
	};

	var ViewModel = function () {
		this.todos = ko.observableArray([]);
		this.current = ko.observable();
		this.showMode = ko.observable('all');

		this.filteredTodos = ko.computed(function () {
			switch (this.showMode()) {
			case 'active':
				return this.todos().filter(function (todo) {
					return !todo.completed();
				});
			case 'completed':
				return this.todos().filter(function (todo) {
					return todo.completed();
				});
			default:
				return this.todos();
			}
		}.bind(this));

		// add a new todo, when enter key is pressed
		this.add = function () {
			var current = this.current().trim();
			if (current) {
                var todo = new Todo(current);
				this.todos.push(todo);
				this.current('');
                Storage.save.bind(todo)()
			}
		}.bind(this);

		// remove a single todo
		this.remove = function (todo) {
			this.todos.remove(todo);
            Storage.remove.bind(todo)(todo.id())
		}.bind(this);

		// remove all completed todos
		this.removeCompleted = function () {
			this.todos.remove(function (todo) {
				if (todo.completed()){
                    Storage.remove.bind(todo)(todo.id());
                    return true;
                }
                return todo.completed();
			});
		}.bind(this);

		// edit an item
		this.editItem = function (item) {
			item.editing(true);
			item.previousTitle = item.title();
		}.bind(this);

		// stop editing an item.  Remove the item, if it is now empty
		this.saveEditing = function (item) {
			item.editing(false);

			var title = item.title();
			var trimmedTitle = title.trim();

			// Observable value changes are not triggered if they're consisting of whitespaces only
			// Therefore we've to compare untrimmed version with a trimmed one to chech whether anything changed
			// And if yes, we've to set the new value manually
			if (title !== trimmedTitle) {
				item.title(trimmedTitle);
			}

			if (!trimmedTitle) {
				this.remove(item);
			}
		}.bind(this);

		this.cancelEditing = function (item) {
			item.editing(false);
			item.title(item.previousTitle);
		}.bind(this);


		this.completedCount = ko.computed(function () {
			return this.todos().filter(function (todo) {
				return todo.completed();
			}).length;
		}.bind(this));


		this.remainingCount = ko.computed(function () {
			return this.todos().length - this.completedCount();
		}.bind(this));

		// writeable computed observable to handle marking all complete/incomplete
		this.allCompleted = ko.computed({
			//always return true/false based on the done flag of all todos
			read: function () {
				return !this.remainingCount();
			}.bind(this),
			// set all todos to the written value (true/false)
			write: function (newValue) {
				this.todos().forEach(function (todo) {
					// set even if value is the same, as subscribers are not notified in that case
					todo.completed(newValue);
				});
			}.bind(this)
		});

		// helper function to keep expressions out of markup
		this.getLabel = function (count) {
			return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
		};
	};
    var viewModel = new ViewModel();











    var Storage = {};

    Storage.save = function save() {
        axios.post('/api/save', ko.toJS(this)).then(function(response){
            viewModel.todos(response.data.map(Storage.mapTodo));
        })
    };

    Storage.remove = function remove(id) {
        if (id) {
            axios.delete('/api/delete/' + id).then(function(response){
                viewModel.todos(response.data.map(Storage.mapTodo));
            })
        }
    };

    Storage.loadAll = function loadAll() {
        axios.get('/api/all').then(function(response){
            viewModel.todos(response.data.map(Storage.mapTodo));
        });
    };

    Storage.mapTodo = function mapTodo(todo) {
        return new Todo(todo.title, todo.completed, todo.id);
    };

    Storage.loadAll();















    ko.applyBindings(viewModel);
    Router({ '/:filter': viewModel.showMode }).init();



}());
