/**
 * utils.js Contiene funciones de utilidad
 */
var util = new function() {
	this.getStringDateNow = function() {
		var hoy = new Date();
		var dia = hoy.getDate();
		if (1 == dia.length) {dia += '0';}
		var mes = hoy.getMonth() + 1;
		if (1 == mes.length) {mes += '0';}
		var anio = hoy.getFullYear();
		
		return dia + '/' + mes + '/' + anio;
	};
	
	this.loaderHide = function() {
		setTimeout(function() {
			jQuery('.spinner').fadeOut(1000, function() {
			    jQuery(this).remove();
			});
		}, 200);
	};

	this.loaderShow = function() {
		var html = '<div class="spinner pull-right"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>';
		if (0 == jQuery('.spinner').length) {
			jQuery('.col-nav').append(html);
		}
	};
};