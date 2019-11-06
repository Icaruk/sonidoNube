
/*
	Pendiente:
		- Botón autoplay
		- Paginación https://developers.soundcloud.com/docs/api/guide#pagination
	.
	
*/


async function busca(modo, busqueda) {
	/*
		busca("tracks", "Amor");			// Busca los tracks que coincidan con "Amor"
		busca("users", "Felipe")			// busca a todos los usuarios que se llamen Felipe
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
		q: busqueda
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
	maxIdx = uti.minMax (cantidad - 1, 0, 9);
	
	
	// Itero el objeto
	let granTochoHtml = "";
	
	for (let _i = 0; _i <= maxIdx; _i++) {
		
		let _x = info[_i];
		
		
		// Saco algunos datos
		let strImg = _x.artwork_url ? _x.artwork_url : "/img/artwork_default.jpg"; // https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg
		let strTitulo = _x.title;
		
		let fecha = new Date (_x.created_at);
		let strFecha = fecha.getFullYear();
		
		
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
			<p class="tr_artista">${strFecha}</p>
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
		
		
		// EHs
		nodo.addEventListener("click", () => pulsaBuscar(_x.username) );
		
		
		// Lo inyecto donde toque
		let idPadre = _i < (maxIdx/2) ? "resultados_parte1" : "resultados_parte2";
		uti.$(idPadre).appendChild(nodo);
		
		
	};
	
};


function muestraNoResultados () {
	
	// Muestro reproductor
	uti.showEle("reproductor", true);
	
	
	// Creo hijo
	let nodo = uti.createNode (`<div class="tarjetaTrack">
		<p class="tr_titulo">No hay resultados con esa búsqueda.</p>
	</div>`);
	
	
	// Lo inyecto donde toque
	uti.$("resultados_parte1").appendChild(nodo);
	
	
};



function pulsaBuscar (userName = "") {
	
	// Obtengo el valor del campo de búsqueda
	let busqueda = uti.$("h_inputBusqueda").value;
	
	
	// Busco info
	let promesa;
	
	if (userName == "") { // búsqueda de track
		
		promesa = busca(tipoBusqueda, busqueda);
		
	} else { // búsqueda de todas las tracks de ese username
		
		seleccionaTipoBusqueda("tracks", false);
		
		uti.$("h_inputBusqueda").value = userName;
		promesa = busca(tipoBusqueda, userName);
		
	};
	
	
	
	// La pinto
	promesa.then(function (res) {
		
		// Log
		console.log( res );
		
		
		// Limpio
		limpiaResultados();
		
		
		// Pinto
		if (res.length === 0) {
			
			muestraNoResultados();
			
		} else {
			
			if (tipoBusqueda == "tracks") {
				
				muestraTracks (res);
				
				// Meto la primera al reproductor y reproduzco
				let idTrack = res[0].id;
				play (idTrack);
				
			} else {
				muestraUsers (res);
			};
			
		};
		
		
		// uti.$("reproductor").src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${idTrack}`;
		
		
		
	});	
	
};



function play (idTrack) {
	
	// uti.$("reproductor").src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${idTrack}`;
	
		
	// widget.load(`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${idTrack}`, {auto_play: true, show_playcount: true});
	widget.load(`https%3A//api.soundcloud.com/tracks/${idTrack}`, {
		auto_play: true,
		show_playcount: true,
		sharing: false
	});
	
	// widget.play(); // no es necesario por el autoplay
	
};



function playIfPaused() {
	
	widget.isPaused( (paused) => {
		
		if (paused) {
			widget.play();
		} else {
			widget.pause();
		};
		
	});
	
};



function raiseVolume(n) {
	
	widget.getVolume( (volume) => {
		widget.setVolume(volume + n);
	});
	
};



function skipTime(ms) {
	
	widget.getPosition( (msActuales) => {
		widget.seekTo(msActuales + ms);
	});
	
};




function seleccionaTipoBusqueda(tipo, buscar = true) {
	
	if (tipoBusqueda != tipo) {
		uti.$("h_tracks").classList.toggle("h_selected");
		uti.$("h_users").classList.toggle("h_selected");
		
		tipoBusqueda = tipo;
		
		if (buscar) {
			pulsaBuscar ();
		};
		
	};
	
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



function pulsaTecla (ev) {
	
	// console.log( ev.key );
	
	
	switch (ev.key) {
		
		case " ":
			playIfPaused();
		break;
		
		case "ArrowUp": 
			raiseVolume(5);
		break;
		
		case "ArrowDown": 
			raiseVolume(-5);
		break;
		
		case "ArrowLeft": 
			skipTime(-5 * 1000);
		break;
		
		case "ArrowRight": 
			skipTime(5 * 1000);
		break;
		
	}
	
};






// Vars
var tipoBusqueda = "tracks";



// EHs
uti.$("h_iconoLupa").addEventListener("click", pulsaBuscar() );
uti.$("h_inputBusqueda").addEventListener("keydown", (ev) => {
	if (ev.key == "Enter") {
		pulsaBuscar();
	};
	
});

uti.$("zonaDrop").addEventListener("dragover", allowDrop);
uti.$("zonaDrop").addEventListener("drop", drop );

uti.$("h_tracks").addEventListener("click", () => seleccionaTipoBusqueda("tracks") );
uti.$("h_users").addEventListener("click", () => seleccionaTipoBusqueda("users") );

document.addEventListener("keydown", pulsaTecla);


// $("#h_iconoLupa").on("click", pulsaBuscar() );



// -------------------------
// Init
// -------------------------

// Oculto la zona de drop
uti.showEle("zonaDrop", false);


// Obtengo el widget
function getWidget() {
	
	let widgetIframe = document.getElementById("reproductor");
	let widget = SC.Widget(widgetIframe);
	
	return widget;
	
};

var widget = getWidget();





