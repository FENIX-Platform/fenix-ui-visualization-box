/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    "fx-v-b/config/config",
    "fx-v-b/config/config-default",
    "fx-v-b/config/errors",
    "fx-v-b/config/events",
    "text!fx-v-b/html/tabs/blank.hbs",
    "handlebars",
    "amplify"
], function ($, log, C, CD, ERR, EVT, tabTemplate, Handlebars) {

    'use strict';

    var defaultOptions = {}, s = {};

    function BlankTab(o) {

        $.extend(true, this, defaultOptions, o);

        return this;
    }

    /* API */
    /**
     * Tab initialization method
     * Optional method
     */
    BlankTab.prototype.init = function () {
        log.info("Tab initialized successfully");
    };

    /**
     * Method invoked when the tab is shown in the FENIX visualization box
     * Mandatory method
     */
    BlankTab.prototype.show = function () {

        var valid = this._validateInput();

        if (valid === true) {

            this._show();

            log.info("Tab shown successfully");

            return this;

        } else {

            log.error("Impossible to create show blank tab");
            log.error(valid)
        }

    };

    /**
     * Check if the current model is suitable to be displayed within the tab
     * Mandatory method
     */
    BlankTab.prototype.isSuitable = function () {

        var isSuitable = this._isSuitable();

        log.info("Is tab suitable? " + isSuitable);

        return isSuitable;

    };

    /**
     * Disposition method
     * Mandatory method
     */
    BlankTab.prototype.dispose = function () {

        this._dispose();

        log.info("Tab disposed successfully");

    };

    /* END API*/

    BlankTab.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if box has an id
        /*        if (!this.id) {

         window.fx_vis_box_id >= 0 ? window.fx_vis_box_id++ : window.fx_vis_box_id = 0;

         this.id = window.fx_vis_box_id;

         log.warn("Impossible to find id. Set auto id to: " + this.id);
         }         */

        //Check if $el exist
        if (this.$el.length === 0) {

            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find tab container");

        }

        return errors.length > 0 ? errors : valid;

    };

    BlankTab.prototype._show = function () {

        this._attach();

        this._initVariables();

        this._bindEventListeners();

    };

    BlankTab.prototype._attach = function () {

        var template = Handlebars.compile(tabTemplate),
            html = template(this);

        this.$el.html(html);
    };

    BlankTab.prototype._initVariables = function () {

    };

    BlankTab.prototype._bindEventListeners = function () {

    };

    BlankTab.prototype._unbindEventListeners = function () {

    };

    BlankTab.prototype._isSuitable = function () {

        return true;
    };

    BlankTab.prototype._dispose = function () {

        this._unbindEventListeners();

    };

    return BlankTab;

});