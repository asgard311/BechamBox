// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

//database instance
var db;

angular.module('BechamBox', ['ionic', 'BechamBox.controllers','BechamBox.services','BechamBox.filters','ngCordova','ionic.rating'])

.run(function($ionicPlatform,$cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);


		 db = window.sqlitePlugin.openDatabase({name: "recipes.db", location: 1}, function(db){
	    	db.executeSql("CREATE TABLE IF NOT EXISTS recipes (id integer primary key, name text,img text,url text, instructions text,notes text)",[]);
		 	db.executeSql("CREATE TABLE IF NOT EXISTS recipe_ingredients (id integer primary key,recipe int,ingredient text)",[]);
			db.executeSql("CREATE TABLE IF NOT EXISTS recipe_reviews (id integer primary key,recipe int,rating int,review text,date date)",[]);
		}, function(err){
		    console.log('Open database ERROR: ' + JSON.stringify(err));
		});	

      	}


    
	if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })

	.state('app.addRecipe',{
		url: '/addRecipe',
		views: {
			'menuContent':{
				templateUrl: 'templates/addRecipe.html',
				controller: 'addRecipeCtrl'
			}
		}

	})
	.state('app.recipes',{
		url: '/recipes',
		views: {
			'menuContent':{
				templateUrl: 'templates/recipes.html',
				controller: 'recipesCtrl'
			}
		}

	})
	.state('app.recipe',{
		url: '/recipe/:id',
		views: {
			'menuContent':{
				templateUrl: 'templates/recipe.html',
				controller: 'recipeCtrl'
			}
		}

	})

    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/addRecipe');
});
