/**
 * podcast.js
 * Contiene la logica de obtencion y mostrado de podcasts
 */
jQuery(function() {
	podcast.getPodcasts();
	
	jQuery('#filter').on('keyup', function() {
		podcast.filterPodcasts(jQuery(this).val());
	});
});

var podcast = new function() {
	// Obtiene los podcast y da la orden de pintado
	this.getPodcasts = function() {
		util.loaderShow();
		var isPodcastsLocal = podcast.isPodcastsLocal();
		
		if (isPodcastsLocal) {
			var datos = podcast.getPodcastsLocal();
			podcast.drawResults(datos.feed.entry);
			util.loaderHide();
		} else {
			jQuery.ajax({
				type: "GET",
				url: "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json",
				dataType: 'json',
				success: function(datos) {
					podcast.setLocalData(datos);
					podcast.drawResults(datos.feed.entry);
					util.loaderHide();
				},
				error: function() {
					console.error('Ha ocurrido un error en la obtención de podcasts de Apple.');
					util.loaderHide();
				}
			});
		}
	};
	
	// Pinta los resultados
	this.drawResults = function(datos) {
		var source   = jQuery("#podcast-result-template").html();
		var template = Handlebars.compile(source);
		
		var obj = {
			entries : datos
		};
		
		var contador = datos.length;
		
		jQuery('#podcasts-list').html(template(obj));
		jQuery('#contador-podcasts').html(contador);

		util.loaderHide();
	};
	
	// Filtra los podcasts
	this.filterPodcasts = function(textFilter) {
		util.loaderShow();
		var datos = podcast.getPodcastsLocal();
		if ('' != textFilter) {
			textFilter = textFilter.toUpperCase();
			datos = $(datos.feed.entry).filter(function (i,n){
				var title = n.title.label.toUpperCase();
				var artist = n['im:artist'].label.toUpperCase();
				
				return (-1 < title.indexOf(textFilter) || -1 < artist.indexOf(textFilter))
			});
		} else {
			datos = datos.feed.entry;
		}
		podcast.drawResults(datos);
	};
	
	// Obtiene los podcast en local
	this.getPodcastsLocal = function() {
		var datos = localStorage.getItem("podcasts");
		return JSON.parse(datos).datos;
	};
	
	// Identifica si los podcast se han de recuperar de local o hay que pedirlos
	this.isPodcastsLocal = function() {
		var hayLocal = false;
		var datos = localStorage.getItem("podcasts");
		
		if (null != datos) {
			datos = JSON.parse(datos);
			var fechaDatos = datos.fecha;
			
			if (fechaDatos == util.getStringDateNow()) {
				hayLocal = true;
			}
		}
		
		return hayLocal;
	};
	
	// Anade los datos en cliente
	this.setLocalData = function(datos) {
		var fechaHoy = util.getStringDateNow();
		
		var podcasts = {
				fecha : fechaHoy
				,datos : datos
		}
		
		podcasts = JSON.stringify(podcasts);
		
		localStorage.setItem("podcasts", podcasts);
	};
};