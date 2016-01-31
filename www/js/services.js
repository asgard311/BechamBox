angular.module('BechamBox.services',[])

.service('scrape',function($http){

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
				getMicrodata(recipe);
			}else{
				//need to do it some other way
			}
		}


		function getMicrodata(recipe){
			var ingredients = recipe.querySelectorAll('[itemprop="ingredients"]')||[];
			
			var microdata = {ingredients:[]};
			microdata.name = recipe.querySelector('[itemprop="name"]').textContent;
			microdata.img = recipe.querySelector('[itemprop="image"]').src || recipe.querySelector('[itemprop="image"]').getAttribute('content');	
			Array.prototype.forEach.call(ingredients,function(el,i){
				microdata.ingredients.push(el.textContent);
			});
			console.log(microdata);
		}
	return{
		get:function(url){
			$http.get(url).then(function(response){
        		var tmp = document.implementation.createHTMLDocument();
				tmp.body.innerHTML = response.data;
				scrape(tmp)
			}),
			function(err){
				alert(err);
			}
	
		}


	}
})

;
