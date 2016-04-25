angular.module('TempoApp', ['services.WebServices'])
.controller('pesquisarController', function($scope, WebServices)
{
	$scope.pesquisarTempo = function(local){
		
		WebServices.pesquisarTempo(local)
		.success(function(data){
			
			$scope.retorno = angular.fromJson(data);
			$scope.previsoes = $scope.retorno.previsoes;
			$scope.pageSize = 1;
			$scope.pegarLatitudeELongitude($scope.retorno.cidade);
		})
		.error(function(data) {
			alert("Ocorreu um erro!");
		});
	}
	
	/*-- Carrega o mapa --*/
	$scope.carregarMapa = function(latitude, longitude){
		var myCenter=new google.maps.LatLng(latitude, longitude);
		
		var mapProp = {
			center:myCenter,
			zoom:7,
			mapTypeId:google.maps.MapTypeId.ROADMAP
		  };
		  
		var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
		
		var marker=new google.maps.Marker({
			position:myCenter,
			animation:google.maps.Animation.BOUNCE
		});

		marker.setMap(map);
	}
	
	/*-- Pega a latitude e longitude do local através do endereço --*/
	$scope.pegarLatitudeELongitude = function(endereco) {
		var geocoder = new google.maps.Geocoder();
		
		geocoder.geocode({ 'address': endereco }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var latitude = results[0].geometry.location.lat();
				var longitude = results[0].geometry.location.lng();
				$scope.carregarMapa(latitude,longitude);			
			} else {
				alert("Ocorreu um erro!")
			}
		});
    };

})