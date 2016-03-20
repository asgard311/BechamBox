angular.module('BechamBox.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('addRecipeCtrl',function($scope,scrape,$state,$ionicModal,$ionicLoading,$ionicPopup,$sce,DB){
	$scope.recipeForm = {URL:'http://www.foodnetwork.com/recipes/rachael-ray/lemon-chicken-recipe.html'};

	$scope.showEdit = false;

	$ionicModal.fromTemplateUrl('recipe-confirm.html',{
		scope:$scope,
		animation:'slide-in-up'
	}).then(function(modal){
		$scope.modal = modal;
	});
	
	//ADD ERROR CHECK
	$scope.grabRecipe = function(){
		$ionicLoading.show({ template: 'Gathering Recipe'});

		scrape.get($scope.recipeForm.URL).then(function(data){
			$ionicLoading.hide();
			$scope.recipe = data;
			$scope.openModal();
		});
	};	


	$scope.saveRecipe = function(){
		var ret = DB.saveRecipe($scope.recipeForm.URL,$scope.recipe).then(function(ret){
			$ionicPopup.alert({
     			title: ret.error ? 'Error' : 'Success',
     			template: ret.msg
   			});	
		
			if(!ret.error){
			//go to recipe list
				$scope.closeModal();
				$state.go('app.recipes');
			}

		});
   	};

	$scope.toggleEdit = function(){
		$scope.showEdit = $scope.showEdit ? false : true;
	};

	$scope.openModal = function() {
    	$scope.modal.show();
  	};
  	$scope.closeModal = function() {
    	$scope.modal.hide();
  	};
  	//Cleanup the modal when we're done with it!
  	$scope.$on('$destroy', function() {
    	$scope.modal.remove();
  	});

})

.controller('recipeCtrl',function($scope,$stateParams,$ionicLoading,$window,DB,$ionicModal,$ionicPopup,$cordovaDatePicker){
	$ionicLoading.show({template:"<ion-spinner></ion-spinner>"});
	
	var id = $stateParams.id;
	$scope.data = {};
	$scope.rating = {max:5,date:new Date()};

	//datepicker options
	var options = {
    	date: new Date(),
    	mode: 'date', // or 'time'

 	};



	$ionicModal.fromTemplateUrl('add-notes.html',{
		scope:$scope,
		animation:'slide-in-up'
	}).then(function(modal){
		$scope.nmodal = modal;

	});

	$ionicModal.fromTemplateUrl('write-review.html',{
		scope:$scope,
		animation:'slide-in-up'
	}).then(function(modal){
		$scope.rmodal = modal;
	});



	$scope.loadRecipe = function(){
		DB.loadRecipe(id).then(function(data){
			$scope.data = data;
			$ionicLoading.hide();

		},function(err){
			console.log(err.message);
			$ionicLoading.hide();
		});
	};	

	$scope.openUrl = function(url){
		$window.open(url,'_system');

	};

	$scope.showAddNotes = function(){
		$scope.nmodal.show();
		
	};

	$scope.reviewRecipe = function(){
		$scope.rmodal.show();
	}

	$scope.openDate = function(){
		$cordovaDatePicker.show(options).then(function(date){
			$scope.rating.date = date;        
    	});
	};

	$scope.saveNotes = function(){
		DB.saveNotes(id,$scope.data.notes).then(function(){
			$ionicPopup.alert({
     			title:  'Success',
     			template: 'Notes Updated'
   			});
			$scope.closeModal();	
		});
	};

	$scope.saveReview = function(){
		DB.saveReview(id,$scope.rating).then(function(){
			$ionicPopup.alert({
				title:'Success',
				template: 'Review Added'
			});
		});
	};

	$scope.closeModal = function(){
		$scope.nmodal.hide();
		$scope.rmodal.hide();
	};

  	//Cleanup the modal when we're done with it!
  	$scope.$on('$destroy', function() {
    	$scope.nmodal.remove();
    	$scope.rmodal.remove();
  	});

	$scope.loadRecipe();
})
.controller('recipesCtrl',function($scope,$ionicLoading,$sce,DB){
	$scope.recipes = [];
	
	$ionicLoading.show({template:"<ion-spinner></ion-spinner>"});

	$scope.loadRecipes = function(){
		DB.loadRecipes().then(function(res){
			var length = res.rows.length;
			for(var i = 0; i < length; i++){

				$scope.recipes.push(res.rows.item(i));
			}			
			$ionicLoading.hide();
		},function(err){
			console.log(err.message);
			$ionicLoading.hide();
		});
	};


	$scope.loadRecipes();
})
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
