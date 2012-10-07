/*jshint unused:false*/

/**
 * Subscribe interface.
 *
 * @author André Cruz <andremiguelcruz@msn.com>
 */
define(['dejavu/Interface'], function (Interface) {

    'use strict';

    return Interface.declare({
        $name: 'SubscribeInterface',

        /**
         * Adds a new event listener.
         * If the listener is already attached, it won't get duplicated.
         *
         * @param {String}   event      The event name
         * @param {Function} fn         The listener
         * @param {Object}   [$context] The context in which the function will be executed, defaults to the instance
         *
         * @return {MixableEventsEmitter} The instance itself to allow chaining
         */
        on: function (event, fn, $context) {},

        /**
         * Removes an existent event listener.
         * If no fn and context is passed, removes all event listeners of a given name.
         * If no event is specified, removes all events of all names.
         *
         * @param {String}   [$event]   The event name
         * @param {Function} [$fn]      The listener
         * @param {Object}   [$context] The context passed to the on() function
         *
         * @return {MixableEventsEmitter} The instance itself to allow chaining
         */
        off: function ($event, $fn, $context) {}
    });
});