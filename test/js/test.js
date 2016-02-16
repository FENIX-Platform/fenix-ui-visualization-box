define([
    'loglevel',
    'fx-v-b/start',
    'text!test/json/uneca_population.json'
],function (log, Box, Model){

    'use strict';

    function Test(){

    }

    Test.prototype.start = function () {

        log.info("Test started");

    };

    return new Test();

});