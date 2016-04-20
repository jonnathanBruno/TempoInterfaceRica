angular.module('services.WebServices', [])

.factory('WebServices', ['$http', function ($http) {

	var WebServices = {};
	var host = 'http://developers.agenciaideias.com.br/tempo/json/';
	
	/*-- Serviços--*/

	WebServices.pesquisarTempo = function(local){
		return $http.post(host + local);
	}
	
    return WebServices;
}]);
