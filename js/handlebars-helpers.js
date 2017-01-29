Handlebars.registerHelper('isZero', function(v1, v2, options) {
    return (0 == (v1 % v2)) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('formatDate', function(param) {
	var fecha = new Date(param.fn(this));
	var dia = fecha.getDate() + '';
	if (1 == dia.length) {
		dia = '0'+dia;
	}
	var mes = (fecha.getMonth() + 1) + '';
	if (1 == mes.length) {
		mes = '0'+mes;
	}
	var ano = fecha.getFullYear();
    return dia+'/'+mes+'/'+ano;
});