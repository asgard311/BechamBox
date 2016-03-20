angular.module('BechamBox.filters',[])
    .filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }])

	.filter('n_to_br',['$sce',function($sce){
		return function(text){
			var html = text.replace(new RegExp("[\n]",'g'),"<br>");
			return $sce.trustAsHtml(html);
		};
	}])


;
