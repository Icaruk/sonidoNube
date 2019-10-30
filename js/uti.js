
/*
const console.log = console.log.bind();
const console.warning = console.warn.bind();
const console.error = console.error.bind();
*/

const uti = {
	
	$ (idElemento) {
		/*
			Selecciona un elemento HTML por su id.
			
			uti.$ ("boton_1");
		*/
		
		return document.getElementById(idElemento);
	},
	
	minMax (n, min, max) {
		/*
			Limita un número por arriba y por abajo.
			
			uti.minMax (15, 0, 10); // devuelve 10
		*/
		
		return Math.max (Math.min (n, max), min);
	},
	
	random (min = 0, max = 100) {
		/*
			Genera un número aleatorio entre min y max.
			
			uti.random (1, 100) // devuelve entre 1 y 100
		*/
		
		return Math.floor (Math.random() * ((max + 1) - min) + min);
	},
	
	selectRandom (arr) {
		/*
			Selecciona un elemento aleatorio de entre todos los de un array.
			
			uti.selectRandom (["a", "b"]); // 50% de a y 50% de b
		*/
		
		return arr [uti.random (0, arr.length -1)];
	},
	
	delFromArr (arr, ele) {
		/*
			Elimina un elemento concreto del array.
			
			uti.delFromArr (miArray, elementoParaEliminar)
		*/
		
		let idx = arr.indexOf(ele);
		if (idx >= 0) {
			arr.splice(idx, 1);
		};
		
	},
	
	equalArr (arr1, arr2) {
		/*
			Devuelve si dos arrays unidimensionales son iguales.
			
			uti.equalArr(arr1, arr2);
		*/
		
		// ¿? Reemplazar por arr1.toString == arr2.toString
		
		if (arr1.length != arr2.length) {
			return false;
		};
		
		for (let i = 0; i < arr1.length; i++) {
			if (arr1[i] != arr2[i]) {
				return false;
			};
		};
		
		
		return true;
		
	},
	
	arrHas (arr, ele) {
		/*
			Comprueba si el arr tiene el elemento ele.
			
			uti.has(miArray, miBusqueda)
		*/
		
		for (let _x of arr) {
			if (this.equalArr(_x, ele)) {
				return true;
			};
		};
		
		
		return false;
		
	},
	
	fadeOut(idEle) {
		/*
			Desvanece un elemento HTML.
			
			uti.fadeOut("idElemento");
		*/
		
		let ele = this.$(idEle);
		
		if (!ele.style.opacity) {
			ele.style.opacity = 1;
		};
		
		
		let loop = setInterval(() => {

			if (ele.style.opacity > 0) {
				ele.style.opacity -= 0.1;
			} else {
				clearInterval(loop);
			}
			
		}, 100);
	},
	
	showEle (idEle, muestra, ocupaEspacio = false) {
		/*
			Muestra u oculta un elemento HTML, haciendo que siga ocupando espacio o no.
			
			uti.showEle(elemento, true); 			// muestra el elemento
			uti.showEle(elemento, true, true); 		// muestra el elemento y hace que ocupe espacio
			uti.showEle(elemento, false); 			// oculta el elemento
			uti.showEle(elemento, false, true); 	// oculta el elemento, pero sigue ocupando espacio
			
		*/
		
		let ele = this.$(idEle);
		let estadoDisplay = muestra ? "block" : "hidden";
		let estadoVisibility = muestra ? "visible" : "hidden";
		
		
		if (ocupaEspacio && !muestra) {
			estado = muestra? "visible" : "hidden";
		};
		
		
		if (ocupaEspacio) {
			ele.style.display = estadoDisplay;
			ele.style.visibility = estadoVisibility;
		} else {
			ele.style.display = estado;
		};
		
		
	},

	animBar (ele, porcentajeWidthFuturo, intervalo = 20) {
		/*
			Anima una barra animando su width desde el actual hasta cierto %.
			
			uti.animBar ("barraVida", 50, 20); // Mueve la barra hasta el 50% con un intervalo de 20ms
			uti.animBar ("barraVida", 20, 50); // Mueve la barra hasta el 20% con un intervalo de 50ms
		*/
		
		if (! ele.style.width) {
			ele.style.width = "100%";
		};
		
		porcentajeWidthFuturo = Math.round (porcentajeWidthFuturo);
		if (porcentajeWidthFuturo < 0 || porcentajeWidthFuturo > 100) {
			return;
		};
		
		
		
		let widthActual = parseInt(ele.style.width);
		let pendiente = porcentajeWidthFuturo - widthActual;
		
		
		let movimiento = pendiente < 0 ? -1 : 1;
		
		
		let loop = setInterval(() => {
			
			let w = Math.round(parseInt(ele.style.width));
			
			
			if (w == porcentajeWidthFuturo) {
				clearInterval(loop);
			} else {
				ele.style.width = `${w + movimiento}%`;
			};
			
		}, intervalo, ele, porcentajeWidthFuturo);
			
	}
	
	/*
	async delayed (ms, fnc) {
		return new Promise (resolve => {
			setTimeout(fnc, ms);
			resolve("");
		});
	}
	*/
	
};



/*
v = 0;
while (v < 3) {

	console.log("Hola");
	uti.delayed (2000, ()=> {console.log("Adios")});
	
	v++;
};
*/

