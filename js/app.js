
function createNode (str) {
	
	let padre = document.createElement("div");
	padre.innerHTML = str;
	
	
	return padre.firstChild;
	
};



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
	
	// Datos
	cantidad = info.length;
	maxIdx = cantidad -1;
	
	
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
		let nodo = createNode (`<div class="tarjetaTrack">
			<img class="tr_img" src="${strImg}" draggable="true" />
			<a href="${_x.permalink_url}" class="tr_artista">${_x.user.username}</a>
			<p class="tr_titulo">${strTitulo}</p>
		</div>`);
		
		
		// Le meto EH
		nodo.addEventListener("dragstart", (ev) => dragStart(ev, _x.id) );
		nodo.addEventListener("dragend", dragEnd );
		
		
		// Tamaño de la fuente del título
		if (charsTitulo > 20) {
			
			let nodoTitulo = nodo.querySelector(".tr_titulo");
			let size = uti.minMax (20 - (charsTitulo * 0.22), 11, 20);
			
			nodoTitulo.style.fontSize = `${size}px`;
			
		};
		
		
		
		// Lo inyecto donde toque
		let idPadre = _i <= 5 ? "resultados_parte1" : "resultados_parte2";
		uti.$(idPadre).appendChild(nodo);
		
		
	};
	
};



function muestraUsers (info) {
	
	maxIdx = info.length -1;
	
	
	// Itero el objeto
	for (let _i = 0; _i <= maxIdx; _i++) {
		
		let _x = info[_i];
		
		
		// Saco algunos datos
		let str_img = _x.avatar_url ? _x.avatar_url : "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg";
		let str_description = _x.description ? _x.description : "";
		let str_online = _x.online ? "ONLINE" : "OFFLINE";
		
		
		// Creo hijo
		let nodo = createNode (`<div>
			<h1><a href="${_x.permalink_url}" target="_blank" rel="noopener noreferrer">${_x.username}</a></h1>
			<img class="img" src="${str_img}" />
			${str_online}
			${str_description}
			
			Followers: ${_x.followers_count}
			Following: ${_x.following_count}
			
		</div>`);
		
		
		// Lo inyecto
		uti.$("resultados").appendChild(nodo);
		
		
	};
	
};



function pulsaBuscar () {
	
	let busqueda = uti.$("h_inputBusqueda").value;
		
	busca("tracks", busqueda)
	.then(function (res) {
		
		// Log
		console.log( res );
		
		
		// Limpio
		limpiaResultados();
		
		
		// Pinto
		muestraTracks (res);
		
		
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
	
	uti.$("reproductor").src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${idTrack}`;
	
};






// EHs
uti.$("h_iconoLupa").addEventListener("click", pulsaBuscar);
uti.$("h_inputBusqueda").addEventListener("keydown", (ev) => {
	if (ev.key == "Enter") {
		pulsaBuscar();
	};
	
});



uti.$("zonaDrop").addEventListener("dragover", allowDrop);
uti.$("zonaDrop").addEventListener("drop", (ev) => drop(ev) );


let muestraDrop = 0;
uti.showEle("zonaDrop", muestraDrop);
uti.showEle("reproductor", !muestraDrop);

