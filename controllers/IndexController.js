angular.module('TempoApp', ['services.WebServices'])
.controller('pesquisarController', function($scope, WebServices)
{
	$scope.pesquisarTempo = function(local){
		
		WebServices.pesquisarTempo(local)
		.success(function(data){
			
			$scope.retorno = angular.fromJson(data);
			if($scope.retorno.agora.descricao == "Tempestuoso")
				teste();
			
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

/*-- CHUVA --*/
	var speed=33;
	var drops=100;
	var colour="#999";
	var flks=new Array();
	var flkx=new Array();
	var flky=new Array();
	var fldy=new Array();
	var swide, shigh, boddie;
function teste(){
	if (document.getElementById) {
	  var r1, r2;
	  boddie=document.createElement("div");
	  boddie.style.position="fixed";
	  boddie.style.top="0px";
	  boddie.style.left="0px";
	  boddie.style.width="1px";
	  boddie.style.height="1px";
	  boddie.style.overflow="visible";
	  boddie.style.backgroundColor="transparent";
	  document.body.appendChild(boddie);
	  set_width();
	  for (var i=0; i<drops; i++) {
		flks[i]=createDiv(16, 2, "transparent");
		r1=createDiv(6, 2, colour);
		r1.style.top="10px";
		r1.style.left="0px";
		flks[i].appendChild(r1);
		r2=createDiv(10, 2, colour);
		r2.style.top="0px";
		r2.style.left="0px";
		if (navigator.appName=="Microsoft Internet Explorer") r2.style.filter="alpha(opacity=25)";
		else r2.style.opacity=0.25;
		flks[i].appendChild(r2);
		flkx[i]=2*Math.floor(Math.random()*swide/2);
		flky[i]=Math.floor(Math.random()*shigh);
		fldy[i]=2+Math.floor(Math.random()*4);
		flks[i].style.left=flkx[i]+"px";
		flks[i].style.top=flky[i]+"px";
		boddie.appendChild(flks[i]);
	  }
	  setInterval("cats_and_dogs()", speed);
	}}

	function createDiv(height, width, colour) {
	  var div=document.createElement("div");
	  div.style.position="absolute";
	  div.style.height=height+"px";
	  div.style.width=width+"px";
	  div.style.overflow="hidden";
	  div.style.backgroundColor=colour;
	  return (div);
	}

	window.onresize=set_width;
	function set_width() {
	  var sw_min=999999;
	  var sh_min=999999;
	  if (document.documentElement && document.documentElement.clientWidth) {
		sw_min=document.documentElement.clientWidth;
		sh_min=document.documentElement.clientHeight;
	  }
	  if (typeof(self.innerWidth)!="undefined" && self.innerWidth) {
		if (self.innerWidth<sw_min) sw_min=self.innerWidth;
		if (self.innerHeight<sh_min) sh_min=self.innerHeight;
	  }
	  if (document.body.clientWidth) {
		if (document.body.clientWidth<sw_min) sw_min=document.body.clientWidth;
		if (document.body.clientHeight<sh_min) sh_min=document.body.clientHeight;
	  }
	  if (sw_min==999999 || sh_min==999999) {
		sw_min=800;
		sh_min=600;
	  }
	  swide=sw_min-2;
	  shigh=sh_min;
	}

	function cats_and_dogs(c) {
	  var i, x, o=0;
	  for (i=0; i<drops; i++) {
		flky[i]+=fldy[i];
		if (flky[i]>=shigh-16) {
		  flky[i]=-16;
		  fldy[i]=2+Math.floor(Math.random()*4);
		  flkx[i]=2*Math.floor(Math.random()*swide/2);
		  flks[i].style.left=flkx[i]+"px";
		}
		flks[i].style.top=flky[i]+"px";
	  }
}
