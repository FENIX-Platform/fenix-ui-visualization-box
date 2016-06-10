/*global define*/
define(function () {

    var config = {

        paths: {
            'fx-v-b/start': './box',
            'fx-v-b/html': '../../html',
            'fx-v-b/js': './',
            'fx-v-b/config' :  '../../config',
            'fx-v-b/nls' :  '../../nls',

            //3rd party libs
            jquery: '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            handlebars: "{FENIX_CDN}/js/handlebars/4.0.5/handlebars.min",
            amplify : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
            underscoreString: "{FENIX_CDN}/js/underscore.string/3.2.2/underscore.string.min",
            i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
            text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
            bootstrap : "{FENIX_CDN}/js/bootstrap/3.3.4/js/bootstrap.min",
            q: '{FENIX_CDN}/js/q/1.1.2/q',
            loglevel: '{FENIX_CDN}/js/loglevel/1.4.0/loglevel',
            swiper : '{FENIX_CDN}/js/swiper/3.3.1/dist/js/swiper.jquery.min'
        },
        shim: {
            bootstrap : {
                deps : ['jquery']
            },
            underscore: {
                exports: '_'
            },
            underscoreString: ['underscore'],
            amplify : {
                deps : ['jquery']
            },
            handlebars: {
                exports: 'Handlebars'
            },
            swiper: {
                deps : ['jquery']
            }
        }
    };

    return config;
});