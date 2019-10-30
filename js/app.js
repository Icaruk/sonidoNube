/*
function muestraResultados () {
	
	const ele_resultados = uti.$("resultados");
	
	ele_resultados.innerHTML = ""; // limpio
	
	
	ele_resultados.appendChild;
	
	
};
*/




SC.initialize({
	client_id: 'aa06b0630e34d6055f9c6f8beb8e02eb',
});


let autor = "asdf";

SC.get('/tracks', {
	q: autor,
}).then(function (tracks) {
	
	
	
});


/*
function Busqueda() {
	
	$('.lista').empty(); //Limpiamos la lista.
	
	var autor = $('input').val();
	
	
	SC.initialize({
		client_id: 'aa06b0630e34d6055f9c6f8beb8e02eb',
	});
	
	
	SC.get('/tracks', {
		q: autor,
	}).then(function (tracks) {
		var numero = 0;
		if (tracks.length > 12) {
			numero = 12;
		} else {
			numero = tracks.length;
		}
		for (var i = 0; i < numero; i++) {
			if (tracks[i].artwork_url !== null) {
				$('.lista').append(
					"<div class='imagen_mini col-xs-2'><img src='" +
					tracks[i].artwork_url +
					"' id ='" +
					tracks[i].id +
					"' draggable='true' ondragstart='drag(event)'></div>"
				);
			}
		}
	});
}
*/


