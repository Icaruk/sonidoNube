
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
	uti.$("resultados").innerHTML = "";
	
};



function muestraTracks (info) {
	
	// Itero
	maxIdx = info.length -1;
	
	
	// Itero el objeto
	for (let _i = 0; _i <= maxIdx; _i++) {
		
		let _x = info[_i];
		
		
		// Saco algunos datos
		let img = _x.artwork_url ? _x.artwork_url : "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg";
		
		
		// Creo hijo
		let nodo = createNode (`<div>
			<h1>${_x.title}</h1>
			<img class="img" src="${img}" />
			${_x.user.username}
			${_x.id}
			
		</div>`);
		
		console.log("nodo: ", nodo );
		
		
		// Lo inyecto
		uti.$("resultados").appendChild(nodo);
		
		
	};
	
};



function muestraUsers (info) {
	
	// Itero
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






// EHs
uti.$("input_tracks").addEventListener("keydown", (ev) => {
	
	if (ev.key == "Enter") {
		
		let busqueda = ev.target.value;
		
		busca("tracks", busqueda)
		.then(function (res) {
			
			// Log
			console.log( res );
			
			
			// Limpio
			limpiaResultados();
			
			
			// Pinto
			muestraTracks (res)
				
		});
		
		
	};
	
});



uti.$("input_users").addEventListener("keydown", (ev) => {
	
	if (ev.key == "Enter") {
		
		let busqueda = ev.target.value;
		
		busca("users", busqueda)
		.then(function (res) {
			
			// Log
			console.log( res );
			
			
			// Limpio
			limpiaResultados();
			
			
			// Pinto
			muestraUsers (res)
			
		});
		
	};
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


