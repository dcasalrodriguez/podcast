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
	
	this.isEmpty = function(str) {
		var vacio = false;
		if (undefined == str || null == str || '' == str) {
			vacio = true;
		}
		return vacio;
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
		if (0 === jQuery('.spinner').length) {
			jQuery('.col-nav').append(html);
		}
	};
	
	this.xmlToJson = function(xml) {
		// Create the return object
		var obj = {};

		if (xml.nodeType == 1) { // element
			// do attributes
			if (xml.attributes.length > 0) {
			obj["attributes"] = {};
				for (var j = 0; j < xml.attributes.length; j++) {
					var attribute = xml.attributes.item(j);
					var value = attribute.nodeValue.toString();
					obj["attributes"][attribute.nodeName] = value;
				}
			}
		} else if (xml.nodeType == 3) { // text
			obj = xml.nodeValue;
		}

		// do children
		if (xml.hasChildNodes()) {
			for(var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				nodeName = nodeName.replace('#','');
				if (nodeName == 'cdata-section' && '' != item.data) {
					obj[nodeName+'_str'] = item.data;
				}
				if (typeof(obj[nodeName]) == "undefined") {
					obj[nodeName] = util.xmlToJson(item);
				} else {
					if (typeof(obj[nodeName].push) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(util.xmlToJson(item));
				}
			}
		}
		
		return obj;
	};
};