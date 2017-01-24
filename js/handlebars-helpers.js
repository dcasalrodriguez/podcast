Handlebars.registerHelper('isZero', function(v1, v2, options) {
    return (0 == (v1 % v2)) ? options.fn(this) : options.inverse(this);
});