/**
 * podcast.js
 * Contiene la logica de obtencion y mostrado de podcasts
 */
jQuery(function() {
	podcast.getPodcasts();
	
	jQuery('#filter').on('keyup', function() {
		podcast.filterPodcasts(jQuery(this).val());
	});
	
	jQuery('.podcast-container').on('click', function() {
		var id = jQuery(this).data('id');
		var title = jQuery(this).find('.podcast-title').html();
		jQuery.router.go('/podcast/'+id, title);
	});
	
	var nomin = localStorage.getItem('dev');
	if (!util.isEmpty(nomin) && '1' == nomin) {
		jQuery('link').each(function() {
			var href = jQuery(this).attr('href');
			if (!util.isEmpty(href)) {
				href = href.replace('.min','');
				jQuery(this).attr('href',href);
				console.log(href);
			}
		});
		jQuery('script').each(function() {
			var href = jQuery(this).attr('src');
			if (!util.isEmpty(href)) {
				href = href.replace('.min','');
				jQuery(this).attr('src',href);
			}
		});
	}
});

var podcast = new function() {
	// Pinta el index
	this.drawIndex = function() {
		jQuery('header').show();
		jQuery('.filters').show();
		jQuery('#podcasts-list').show();
		jQuery('#podcasts-cdetail').hide();
		jQuery('#podcasts-detail').hide();
	};
	
	// Pinta el detalle
	this.drawDetail = function(datos) {
		var source   = jQuery("#podcast-detail-template").html();
		var template = Handlebars.compile(source);
		
		var obj = {
			entry : datos
		};

		jQuery('#podcasts-detail').html(template(obj));

		util.loaderHide();
		
		jQuery('header').hide();
		jQuery('#podcasts-list').hide();
		jQuery('#podcasts-cdetail').hide();
		jQuery('#podcasts-detail').show();
	};
	
	// Pinta los resultados
	this.drawResults = function(datos, template, id, transition, podId) {
		transition = transition || null;
		podId = podId || null;
		var source   = jQuery(template).html();
		var template = Handlebars.compile(source);
		
		var obj = {
			entries : datos,
			id: podId
		};
		
		jQuery(id).html(template(obj));

		if (!util.isEmpty(transition)) {
			var sectionActual = jQuery('section:visible');
			sectionActual.hide('slide', {direction: 'left'}, 500, function() {
				jQuery(id).show('slide', {direction: 'left'}, 500);
			});
		}
		
		if (util.isEmpty(podId)) {
			jQuery('.filters').show();
		} else {
			jQuery('.filters').hide();
			jQuery('.btn-volver').attr('href', 'javascript:jQuery.router.go("/podcast", "");');
		}
		
		util.loaderHide();
	};
	
	// Obtiene y pinta los episodios
	this.getEpisodeResults = function(feedUrl, id) {
		util.loaderShow();
		var localDataId = 'podcasts-episodes-'+id;
		
		jQuery.ajax({
			url: 'php/proxyCross.php?url='+feedUrl,
			type: 'xml',
			success: function(datos) {
				datos = util.xmlToJson(datos);
				
				// Almacena los datos en local y pinta la pantalla
				podcast.setLocalData(datos,localDataId);
				podcast.drawResults(datos.rss.channel, '#podcast-episodes-template', '#podcasts-episodes', true, id);
			},
			error: function() {
				console.error('Ha ocurrido un error en la obtención de episodios de Apple.');
				util.loaderHide();
			}
		});
	};
	
	// Obtiene los podcast y da la orden de pintado
	this.getPodcastEpisodes = function(id) {
		util.loaderShow();
		
		var template = '#podcast-episodes-template';
		var divTemplate = '#podcasts-episodes';
		var localDataId = 'podcasts-episodes-'+id;
		
		var isPodcastsLocal = podcast.isPodcastsLocal(localDataId);

		if (isPodcastsLocal) {
			var datos = podcast.getPodcastsLocal(localDataId);
			
			if (util.isEmpty(datos) || util.isEmpty(datos.rss)) {
				console.info('Datos en local con errores, se crea una nueva peticion.');
				podcast.removeLocalData(localDataId);
				podcast.getPodcastEpisodes(id);
			} else {
				podcast.drawResults(datos.rss.channel, template, divTemplate, true, id);
				util.loaderHide();
			}
		} else {
			jQuery.getJSON("https://itunes.apple.com/lookup?id="+id   
                    + "&callback=?", function(datos) {  
				// Se obtienen los episodios
				var url = datos.results[0].feedUrl;
				podcast.getEpisodeResults(url, id);
			});
		}
	};
	
	// Obtiene los podcast y da la orden de pintado
	this.getPodcasts = function() {
		util.loaderShow();
		
		var template = '#podcast-result-template';
		var divTemplate = '#podcasts-list';
		var localDataId = 'podcasts';
		
		var isPodcastsLocal = podcast.isPodcastsLocal(localDataId);

		if (isPodcastsLocal) {
			var datos = podcast.getPodcastsLocal(localDataId);
			if (util.isEmpty(datos.feed) || util.isEmpty(datos.feed.entry)) {
				console.info('Datos en local con errores, se crea una nueva peticion.');
				podcast.removeLocalData(localDataId);
				podcast.getPodcasts();
			} else {
				podcast.drawResults(datos.feed.entry, template, divTemplate);
				var contador = datos.feed.entry.length;
				jQuery('#contador-podcasts').html(contador);
				util.loaderHide();
			}
		} else {
			jQuery.ajax({
				type: "GET",
				url: "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json",
				dataType: 'json',
				async: false,
				success: function(datos) {
					podcast.setLocalData(datos,localDataId);
					podcast.drawResults(datos.feed.entry, template, divTemplate);
					var contador = datos.feed.entry.length;
					jQuery('#contador-podcasts').html(contador);
					util.loaderHide();
				},
				error: function() {
					console.error('Ha ocurrido un error en la obtención de podcasts de Apple.');
					util.loaderHide();
				}
			});
		}
	};
	
	// Filtra los podcasts
	this.filterPodcasts = function(textFilter) {
		var template = '#podcast-result-template';
		var divTemplate = '#podcasts-list';
		util.loaderShow();
		var datos = podcast.getPodcastsLocal('podcasts');
		if ('' != textFilter) {
			textFilter = textFilter.toUpperCase();
			datos = jQuery(datos.feed.entry).filter(function (i,n){
				var title = n.title.label.toUpperCase();
				var artist = n['im:artist'].label.toUpperCase();
				
				return (-1 < title.indexOf(textFilter) || -1 < artist.indexOf(textFilter))
			});
		} else {
			datos = datos.feed.entry;
		}
		var contador = datos.length;
		jQuery('#contador-podcasts').html(contador);
		
		podcast.drawResults(datos, template, divTemplate);
		
		jQuery('.podcast-container').on('click', function() {
			var id = jQuery(this).data('id');
			var title = jQuery(this).find('.podcast-title').html();
			jQuery.router.go('/podcast/'+id, title);
		});
	};
	
	// Obtiene los podcast en local
	this.getPodcastsLocal = function(idDatos) {
		var datos = localStorage.getItem(idDatos);
		return JSON.parse(datos).datos;
	};
	
	// Identifica si los podcast se han de recuperar de local o hay que pedirlos
	this.isPodcastsLocal = function(idDatos) {
		var hayLocal = false;
		var datos = localStorage.getItem(idDatos);
		
		if (null != datos) {
			datos = JSON.parse(datos);
			var fechaDatos = datos.fecha;

			if (fechaDatos == util.getStringDateNow()) {
				hayLocal = true;
			}
		}

		return hayLocal;
	};
	
	this.showPod = function(id, podId) {
		var titulo = jQuery('#title_'+id).val();
		var desc = jQuery('#desc_'+id).val();
		var mp3 = jQuery('#mp3_'+id).val();
		
		jQuery('.podtitle').html(titulo);
		jQuery('.poddesc').html(desc);
		jQuery('.podaudio').attr('src',mp3);
		
		jQuery('.episodes').fadeOut(500,function() {
			jQuery('.podcast-detail').fadeIn(500);
			jQuery('.btn-volver').attr('href', 'javascript:jQuery.router.go("/podcast/'+podId+'", "");');
		});
	};
	
	// Borra los datos en cliente
	this.removeLocalData = function(idDatos) {
		localStorage.removeItem(idDatos);
	};
	
	// Anade los datos en cliente
	this.setLocalData = function(datos, idDatos) {
		var fechaHoy = util.getStringDateNow();
		
		var podcasts = {
				fecha : fechaHoy
				,datos : datos
		}
		
		podcasts = JSON.stringify(podcasts);
		
		localStorage.setItem(idDatos, podcasts);
	};
};