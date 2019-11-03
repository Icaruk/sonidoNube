
// limit


async function busca(modo, busqueda) {
	/*
		busca("tracks", busqueda)
		busca("users", busqueda)
	*/
	
	
	// Auth
	SC.initialize({
		client_id: 'aa06b0630e34d6055f9c6f8beb8e02eb',
	});
	
	
	// Limpio búsqueda
	busqueda = busqueda.trim();
	
	
	// Log
	console.log ( `Petición (${modo}): ${busqueda}` ); 
	
	
	// Petición
	let promise = SC.get(`/${modo}`, {
		q: busqueda,
	});
	
	
	// Return
	return promise;
	
};



function limpiaResultados() {
	
	// Limpio resultados anteriores
	uti.$("resultados_parte1").innerHTML = "";
	uti.$("resultados_parte2").innerHTML = "";
	
};



function muestraTracks (info) {

	// Muestro reproductor
	uti.showEle("reproductor", true);
	
		
	// Datos
	cantidad = info.length;
	maxIdx = uti.minMax (cantidad -1, 0, 9);
	
	
	// Itero el objeto
	for (let _i = 0; _i <= maxIdx; _i++) {
		
		let _x = info[_i];
		
		
		// Saco algunos datos
		let strImg = _x.artwork_url ? _x.artwork_url : "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg";
		let strTitulo = _x.title;
		
		
		// Limito caracteres del título
		let maxChars = 60;
		let charsTitulo = strTitulo.length;
		
		if (charsTitulo > maxChars) {
			strTitulo = strTitulo.substring (0, maxChars - 3) + "...";
			charsTitulo = strTitulo.length;
		};		
		
		
		// Creo hijo
		let nodo = uti.createNode (`<div class="tarjetaTrack">
			<img class="tr_img" src="${strImg}" draggable="true" />
			<a href="${_x.permalink_url}" class="tr_artista">${_x.user.username}</a>
			<p class="tr_titulo">${strTitulo}</p>
		</div>`);
		
		
		// Le meto EH
		nodo.addEventListener("dragstart", (ev) => dragStart(ev, _x.id) );
		nodo.addEventListener("dragend", dragEnd );
		nodo.addEventListener("click", () => play(_x.id) );
		
		
		// Tamaño de la fuente del título
		if (charsTitulo > 20) {
			
			let nodoTitulo = nodo.querySelector(".tr_titulo");
			let size = uti.minMax (20 - (charsTitulo * 0.22), 11, 20);
			
			nodoTitulo.style.fontSize = `${size}px`;
			
		};
		
		
		
		// Lo inyecto donde toque
		let idPadre = _i < (maxIdx/2) ? "resultados_parte1" : "resultados_parte2";
		uti.$(idPadre).appendChild(nodo);
		
		
	};
	
};



function muestraUsers (info) {

	// Oculto reproductor
	uti.showEle("reproductor", false);
	
	
	// Datos
	cantidad = info.length;
	maxIdx = uti.minMax (cantidad -1, 0, 13);	
	
	
	// Itero el objeto
	for (let _i = 0; _i <= maxIdx; _i++) {
		
		let _x = info[_i];
		
		
		// Saco algunos datos
		let str_img = _x.avatar_url ? _x.avatar_url : "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg";
		let str_online = _x.online ? "ONLINE" : "OFFLINE";
		
		
		// Creo hijo
		let nodo = uti.createNode (`<div class="tarjetaUser">
			<img class="tu_img" src="${str_img}" />
			<a href="${_x.permalink_url}" class="tr_artista">${_x.username}</a>
			${str_online}
		</div>`);
		
		
		
		// Lo inyecto donde toque
		let idPadre = _i < (maxIdx/2) ? "resultados_parte1" : "resultados_parte2";
		uti.$(idPadre).appendChild(nodo);
		
		
	};
	
};



function pulsaBuscar () {
	
	let busqueda = uti.$("h_inputBusqueda").value;
	
	busca(tipoBusqueda, busqueda)
	.then(function (res) {
		
		// Log
		console.log( res );
		
		
		// Limpio
		limpiaResultados();
		
		
		// Pinto
		if (tipoBusqueda == "tracks") {
			muestraTracks (res);
		} else {
			muestraUsers (res);
		};
		
		
		
		// Meto la primera al reproductor
		let idTrack = res[0].id;
		uti.$("reproductor").src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${idTrack}`;
		
			
	});	
	
};



function dragStart(ev, idTrack) {
	
	ev.dataTransfer.setData("idTrack", idTrack);
	
	uti.showEle("zonaDrop", true);
	uti.showEle("reproductor", false);	
	
};

function dragEnd() {
	
	uti.showEle("zonaDrop", false);
	uti.showEle("reproductor", true);	
	
};

function allowDrop(ev) {
	ev.stopPropagation();
	ev.preventDefault();
};

function drop(ev) {
	
	ev.stopPropagation();
	ev.preventDefault();
	
	let idTrack = ev.dataTransfer.getData("idTrack");
	play(idTrack);
	
};



function play (idTrack) {
	uti.$("reproductor").src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${idTrack}`;
	console.log( SC.Widget );
	
};



function seleccionaTipoBusqueda(tipo) {
	
	if (tipoBusqueda != tipo) {
		uti.$("h_track").classList.toggle("h_selected");
		uti.$("h_user").classList.toggle("h_selected");
		
		tipoBusqueda = tipo;
		
		pulsaBuscar ();
		
	};
	
};



// Vars
var tipoBusqueda = "tracks";



// EHs
uti.$("h_iconoLupa").addEventListener("click", pulsaBuscar);
uti.$("h_inputBusqueda").addEventListener("keydown", (ev) => {
	if (ev.key == "Enter") {
		pulsaBuscar();
	};
	
});


uti.$("zonaDrop").addEventListener("dragover", allowDrop);
uti.$("zonaDrop").addEventListener("drop", (ev) => drop(ev) );

uti.$("h_track").addEventListener("click", () => seleccionaTipoBusqueda("tracks") );
uti.$("h_user").addEventListener("click", () => seleccionaTipoBusqueda("users") );




let muestraDrop = 0;
uti.showEle("zonaDrop", muestraDrop);
uti.showEle("reproductor", muestraDrop);

