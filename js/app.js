(function() {

    var app = angular.module('timer', ['ngRoute']);

    app.config(function($routeProvider) {
    
        $routeProvider

        .when('/', {
            templateUrl: 'templates/projects.html',
            controller: 'projectsCtrl'
        })

        .when('/tasks/:id', {
            templateUrl: 'templates/tasks.html',
            controller: 'tasksCtrl'
        })

    });
    
    app.factory('uuid', function() {
        return {
            generate: function() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                        return v.toString(16);
                });
        }
        }
    })

    app.factory('storage', function() {
        
        var store = window.localStorage;

        return {
            set: function(key, value) {
                store.setItem(key, JSON.stringify(value));
            },
            get: function(key) {
                return JSON.parse(store.getItem(key));
            },
            getProjectByUuid: function(uuid) {
                projects = this.get('projects');
                project = false;
                angular.forEach(projects, function(v, k) {
                    if(v.uuid === uuid) {
                        project = v;
                    }
                });
                return project;
            },
            remove: function(key) {
                store.removeItem(key);
            }
        }
    
    })

    app.controller('projectsCtrl', function($scope, uuid, storage) {


        $scope.projects = storage.get('projects') || [];

        $scope.addProject = function(project) {
            if(project) {
                $scope.projectName = '';
                var project = {
                    uuid: uuid.generate(),
                    name: project
                }
                $scope.projects.push(project);
                storage.set('projects', $scope.projects);
            }
        }

        $scope.deleteProject = function(index) {
            if(confirm('Are you sure?')) {
                storage.remove('tasks-' + $scope.projects[index].uuid);
                $scope.projects.splice(index, 1);
                // @todo factory
                storage.set('projects', $scope.projects);
            }
        };

    });
    
    app.controller('tasksCtrl', function($scope, $routeParams, storage, uuid) {
    
        $scope.project = storage.getProjectByUuid($routeParams.id);

        $scope.tasks = storage.get('tasks-' + $routeParams.id) || [];

        $scope.addTask = function(task) {
            if(task) {
                $scope.taskName = '';
                var task = {
                    uuid: uuid.generate(),
                    name: task,
                    timer: 0
                }
                $scope.tasks.push(task);
                storage.set('tasks-' + $routeParams.id, $scope.tasks);
            }
        }

        $scope.deleteTask = function(index) {
            if(confirm('Are you sure?')) {
                $scope.tasks.splice(index, 1);
                // @todo factory
                storage.set('tasks-' + $routeParams.id, $scope.tasks);
            }
        };
    
        $scope.startTimer = function($index) {
            $scope.tasks[$index].running = true;
            storage.set('tasks-' + $routeParams.id, $scope.tasks);
        }

        $scope.stopTimer = function($index) {
            $scope.tasks[$index].running = false;
            storage.set('tasks-' + $routeParams.id, $scope.tasks);
        }

    });

})();
