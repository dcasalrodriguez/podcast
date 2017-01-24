/**
 * utils.js Contiene funciones de utilidad
 */
var util = new function() {
	this.loaderHide = function() {
		setTimeout(function() {
			jQuery('.spinner').fadeOut(1000, function() {
			    jQuery(this).remove();
			});
		}, 200);
	};

	this.loaderShow = function() {
		var html = '<div class="spinner pull-right"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>';
		jQuery('.col-nav').append(html);
	};
};