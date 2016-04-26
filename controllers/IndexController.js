angular.module('TempoApp', ['services.WebServices'])
.controller('pesquisarController', function($scope, WebServices)
{
	$scope.pesquisarTempo = function(local){
		
		WebServices.pesquisarTempo(local)
		.success(function(data){
			
			$scope.retorno = angular.fromJson(data);
			$scope.carregarGrafico($scope.retorno.previsoes);
			$scope.previsoes = $scope.retorno.previsoes;
			$scope.pageSize = 1;
			$scope.pegarLatitudeELongitude($scope.retorno.cidade);
		})
		.error(function(data) {
			alert("Ocorreu um erro!");
		});
	}
	
	$scope.carregarGrafico = function(previsoes){	
		var previsoesTemp = [];
		for(var i=0; i<previsoes.length; i++){
			previsoesTemp[i] = previsoes[i].temperatura_max;
		}
		var previsoesTempOrdendas = previsoesTemp.sort(function(a, b){return b-a});
		
		var maiorValor = 0;
		var tresMaiores = [];
		tresMaiores[0] = previsoesTempOrdendas[0];
		var aux=1;
		
		for(var u=1; u<previsoes.length; u++){
			if(tresMaiores[aux-1] != previsoesTempOrdendas[u])
				tresMaiores[aux++] = previsoesTempOrdendas[u];
			if(aux==3)
				break;
		}
		
		var data = [];
		var aux = 0;
		var flag = 0;
		for(var j=0; j<previsoesTempOrdendas.length; j++){
			if(aux==3)
				break;
			if(previsoesTempOrdendas[j] == tresMaiores[aux]){
				flag++;
				if(previsoesTempOrdendas.length == j+1)
					data[aux++] = flag;
			}
			else{
				data[aux++] = flag;
				flag = 1;
			}
		}
		
		var ctx = document.getElementById("myChart");
		var data = {
			labels: tresMaiores,
			datasets: [
				{
					data: data,
					backgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56"
					],
					hoverBackgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56"
					]
				}]
		};
		var myPieChart = new Chart(ctx,{
			type: 'pie',
			data: data,
			animation:{
				animateScale:true
			}
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