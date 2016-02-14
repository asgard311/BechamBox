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

.controller('addRecipeCtrl',function($scope,scrape,$ionicModal,$ionicLoading,$sce,$cordovaSQLite){
	$scope.recipeForm = {URL:'http://www.foodnetwork.com/recipes/rachael-ray/lemon-chicken-recipe.html'};

	$scope.showEdit = false;
	var db = $cordovaSQLite.openDB({ name: "recipes.db" });

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
		//save into sql (check if same url, and if so overwrite it
		var query = "SELECT id FROM recipes WHERE url = ?";
		$cordovaSQLite.execute(db,query,[$scope.recipeForm.URL]).then(function(res){
			//if recipe exists based on URL - update
			if(res.rows.length > 0){
				var recipe_id = res.rows.item(0).id;
	    		$cordovaSQLite.execute(db, "UPDATE recipes SET name = ?,img = ?,instructions = ? WHERE id = ?",
					[$scope.recipe.name,$scope.recipe.img,$scope.recipe.instructions,recipe_id]).then(function(res) {
    					//delete/insert new ingredients
					$cordovaSQLite.execute(db,"DELETE FROM recipe_ingredients WHERE recipe = ?",[recipe_id]).then(function(res){
						$scope.recipe.ingredients.forEach(function(val){
							$cordovaSQLite.execute(db,"INSERT INTO recipe_ingredients (recipe,ingredient) VALUES (?,?)",[recipe_id,val])
						});
					});
						
				}, function (err) {
	      					console.error(err);
    			});
			}else{
				//inserting
				$cordovaSQLite.execute(db, "INSERT INTO recipes (name,img,text,url,instructions) VALUES (?,?,?,?,?)", 
					[$scope.recipe.name,$scope.recipe.img,$scope.recipeForm.URL,$scope.recipe.instructions]).then(function(res) {						
					var recipe_id = res.insertId;
    				//insert new ingredients
					$scope.recipe.ingredients.forEach(function(val){
						$cordovaSQLite.execute(db,"INSERT INTO recipe_ingredients (recipe,ingredient) VALUES (?,?)",[recipe_id,val])
					});				
				}, function (err) {
	      				console.error(err);
    			});
			}			
		});
   	};

	$scope.toggleEdit = function(){
		$scope.showEdit = $scope.showEdit ? false : true;
		console.log($scope.showEdit);
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
