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

;
