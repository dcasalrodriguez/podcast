/**
 * podcast.js
 * Contiene la logica de obtencion y mostrado de podcasts
 */
jQuery(function() {
	podcast.getPodcasts();
});

var podcast = new function() {
	// Obtiene los podcast y da la orden de pintado
	this.getPodcasts = function() {
		util.loaderShow();
		var isPodcastsLocal = podcast.isPodcastsLocal();
		
		if (isPodcastsLocal) {
			var datos = podcast.getPodcastsLocal();
			podcast.drawResults(datos);
			util.loaderHide();
		} else {
			jQuery.ajax({
				type: "GET",
				url: "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json",
				dataType: 'json',
				success: function(datos) {
					podcast.setLocalData(datos);
					podcast.drawResults(datos);
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
		var source   = $("#podcast-result-template").html();
		var template = Handlebars.compile(source);
		
		var obj = {
			entries : datos.feed.entry
		};
		
		console.log(obj);
		
		$('#podcasts-list').html(template(obj));
	};
	
	// Filtra los podcasts
	this.filterPodcasts = function() {
		
	};
	
	// Obtiene los podcast en local
	this.getPodcastsLocal = function() {
		
	};
	
	// Identifica si los podcast se han de recuperar de local o hay que pedirlos
	this.isPodcastsLocal = function() {
		
	};
	
	// Anade los datos en cliente
	this.setLocalData = function(datos) {
		
	};
};