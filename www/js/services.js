angular.module('BechamBox.services',[])

.service('scrape',function($http,$q){

	function scrape(data){
			var result = {};
			var items = data.querySelectorAll("[itemscope]");
			var recipe = null;
			Array.prototype.map.call(items,function(el,i){
				if(el.getAttribute('itemtype') == 'http://schema.org/Recipe'){
					recipe = el;
				};
			});
			
			if(recipe){
				var recipeData = getMicrodata(recipe);
				if(data){
					var ogImage = data.querySelector("[property='og:image']").getAttribute('content');
					recipeData.img = ogImage;
				}
				return recipeData;
			}else{
				//need to do it some other way
			}
		}


		function getMicrodata(recipe){
			var ingredients = recipe.querySelectorAll('[itemprop="ingredients"]')||[];
			
			var microdata = {ingredients:[]};
			microdata.name = recipe.querySelector('[itemprop="name"]').textContent;
			microdata.instructions = recipe.querySelector('[itemprop="recipeInstructions"]').textContent;
//			microdata.img = recipe.querySelector('[itemprop="image"]').src || recipe.querySelector('[itemprop="image"]').getAttribute('content');	
			Array.prototype.forEach.call(ingredients,function(el,i){
				microdata.ingredients.push(el.textContent);
			});

			return microdata;
		}
	return{
		get:function(url){
			var dfd = $q.defer();
			var data = '';

			$http.get(url).then(function(response){
        		var tmp = document.implementation.createHTMLDocument();
				tmp.body.innerHTML = response.data;
				data = scrape(tmp);
				dfd.resolve(data)
			}),
			function(err){
				alert(err);
			}
			return dfd.promise;
		}


	}
})

.service('DB',function($q,$cordovaSQLite){
	return {
		saveRecipe: function(url,recipe){
			var dfd = $q.defer();
			var data = '';

			//save into sql (check if same url, and if so overwrite it
			var query = "SELECT id FROM recipes WHERE url = ?";
			$cordovaSQLite.execute(db,query,[url]).then(function(res){
				//if recipe exists based on URL - update
				if(res.rows.length > 0){
					var recipe_id = res.rows.item(0).id;

	    			$cordovaSQLite.execute(db, "UPDATE recipes SET name = ?,img = ?,instructions = ? WHERE id = ?",
						[recipe.name,recipe.img,recipe.instructions,recipe_id]).then(function(res) {
    						//delete/insert new ingredients
						$cordovaSQLite.execute(db,"DELETE FROM recipe_ingredients WHERE recipe = ?",[recipe_id]).then(function(res){
							recipe.ingredients.forEach(function(val){
								$cordovaSQLite.execute(db,"INSERT INTO recipe_ingredients (recipe,ingredient) VALUES (?,?)",[recipe_id,val])
							});
							data = {id:recipe_id,msg:"Recipe Updated"};
							dfd.resolve(data);
						});
						
					}, function (err) {
							console.log(err.message);
	      					data = {msg:err.message,error:true};
							dfd.resolve(data);
    				});
				}else{

					//inserting
					$cordovaSQLite.execute(db, "INSERT INTO recipes (name,img,url,instructions) VALUES (?,?,?,?)", 
						[recipe.name,recipe.img,url,recipe.instructions]).then(function(res) {						
						var recipe_id = res.insertId;

    					//insert new ingredients
						recipe.ingredients.forEach(function(val){
							$cordovaSQLite.execute(db,"INSERT INTO recipe_ingredients (recipe,ingredient) VALUES (?,?)",[recipe_id,val])
						});
						data = {id:recipe_id,msg:"Recipe Saved"};	
						dfd.resolve(data);			
					}, function (err) {
		      				data = {msg:err.message,error:true};
							dfd.resolve(data);
  		  			});
				}			
			});
			return dfd.promise
		},
		loadRecipes:function(){
			return $cordovaSQLite.execute(db,"SELECT * FROM recipes ORDER BY name",[]);
		},
		loadRecipe:function(id){
			var df = $q.defer();
			//get recipe and then ingredients
			$cordovaSQLite.execute(db,"SELECT r.notes,r.id,r.name,r.img,r.url,r.instructions,i.ingredient as ingredients FROM recipes r INNER JOIN recipe_ingredients i on i.recipe = r.id WHERE r.id = ?",[id])
			.then(function(res){
					var data = res.rows.item(0);
					data.ingredients = [data.ingredients];
					for(var i = 1; i < res.rows.length; i++){
						data.ingredients.push(res.rows.item(i).ingredients);
					}
					df.resolve(data)
				},function(err){
					console.log(err.message);
					df.resolve();
				});

			return df.promise;
		},
		saveNotes: function(id,notes){
			return $cordovaSQLite.execute(db,"UPDATE recipes SET notes = ? WHERE id = ?",[notes,id]);
		},
		saveReview: function(id,rating){
			return $cordovaSQLite.execute(db,"INSERT INTO recipe_reviews (recipe,rating,review,date) VALUES (?,?,?,?)",[id,rating.rate,rating.notes,rating.date]);
		
		}
	};


})
;
