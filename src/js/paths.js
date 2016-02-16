define(function () {

    var config = {

        paths: {
            'fx-v-b/start': './start',
            'fx-v-b/html': '../html',
            'fx-v-b/js': './',
            'fx-v-b/config' :  '../config',

            //3rd party libs
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'handlebars': "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
            'amplify' : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
            i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
            text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
            //'q': '{FENIX_CDN}/js/q/1.1.2/q'
        },
        shim: {
            underscore: {
                exports: '_'
            },
            'amplify' : {
                deps : ['jquery']
            },
            handlebars: {
                exports: 'Handlebars'
            }
        }
    };

    return config;
});