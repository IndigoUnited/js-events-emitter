/**
 * MixableEventsEmitter.
 * This is an abstract class because it is meant to be mixed in and not used as a standalone class.
 * This was necessary because the fireEvent had to be declared protected.
 */
define(function () {

    'use strict';

    function MixableEventsEmitter() {}

    /**
     * Adds a new event listener.
     * If the listener is already attached, it won't get duplicated.
     *
     * @param {String}   event     The event name
     * @param {Function} fn        The listener
     * @param {Object}   [context] The context in which the function will be executed, defaults to the instance
     *
     * @return {MixableEventsEmitter} The instance itself to allow chaining
     */
    MixableEventsEmitter.prototype.on = function (event, fn, context) {
        var events;

        this._listeners = this._listeners || {};
        events = this._listeners[event] = this._listeners[event] || [];

        if (getListenerIndex.call(this, event, fn, context) === -1) {
            events.push({ fn: fn, callable: fn, context: context });
        }

        return this;
    };

    /**
     * Adds a new event listener that is removed automatically afterwards.
     * If the listener is already attached, it won't get duplicated.
     *
     * @param {String}   event     The event name
     * @param {Function} fn        The listener
     * @param {Object}   [context] The context in which the function will be executed, defaults to the instance
     *
     * @return {MixableEventsEmitter} The instance itself to allow chaining
     */
    MixableEventsEmitter.prototype.once = function (event, fn, context) {
        var events,
            callable,
            that = this;

        this._listeners = this._listeners || {};
        events = this._listeners[event] = this._listeners[event] || [];

        if (getListenerIndex.call(this, event, fn, context) === -1) {
            callable = function () {
                fn.apply(this, arguments);
                that.off(event, fn, context);
            };

            events.push({ fn: fn, callable: callable, context: context });
        }

        return this;
    };

    /**
     * Removes an existent event listener.
     * If no fn and context is passed, removes all event listeners of a given name.
     * If no event is specified, removes all events of all names.
     *
     * @param {String}   [event]   The event name
     * @param {Function} [fn]      The listener
     * @param {Object}   [context] The context passed to the on() function
     *
     * @return {MixableEventsEmitter} The instance itself to allow chaining
     */
    MixableEventsEmitter.prototype.off = function (event, fn, context) {
        this._listeners = this._listeners || {};

        if (!fn && arguments.length < 2) {
            clearListeners.call(this, event);
        } else {
            var index = getListenerIndex.call(this, event, fn, context);

            if (index !== -1) {
                if (this._firing) {
                    this._listeners[event][index] = {};
                } else {
                    if (this._listeners[event].length === 1) {
                        delete this._listeners[event];
                    } else {
                        this._listeners[event].splice(index, 1);
                    }
                }
            }
        }

        return this;
    };

    /////////////////////////////////////////////////////////////////////////////////////

    /**
     * Emits an event.
     *
     * @param {String}   event The event name
     * @param {...mixed} [args] The arguments to pass along with the event
     *
     * @return {MixableEventsEmitter} The instance itself to allow chaining
     */
    MixableEventsEmitter.prototype._emit = function (event) {
        var listeners,
            params,
            x,
            curr;

        this._listeners = this._listeners || {};
        listeners = this._listeners[event];

        if (listeners) {
            params = Array.prototype.slice.call(arguments, 1),
            this._firing = true;

            for (x = 0; x < listeners.length; x += 1) {
                curr = listeners[x];

                if (curr.fn) {
                    curr.callable.apply(curr.context || this, params);
                } else {
                    listeners.splice(x, 1);
                    x -= 1;
                }
            }

            if (listeners.length === 0) {
                delete this._listeners[event];
            }

            this._firing = false;
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////

    /**
     * Gets a listener index.
     *
     * @param {String}   name      The event name
     * @param {Function} fn        The function
     * @param {Object}   [context] The context passed to the on() function
     *
     * @return {Number} The index of the listener if found or -1 if not found
     */
    function getListenerIndex(event, fn, context) {
        /*jshint validthis:true*/
        var events = this._listeners[event],
            x,
            curr;

        if (events) {
            for (x = events.length - 1; x >= 0; x -= 1) {
                curr = events[x];
                if (curr.fn === fn && curr.context === context) {
                    return x;
                }
            }
        }

        return -1;
    }

    /**
     * Removes all listeners of the given event name.
     * If no event is specified, removes all events of all names.
     *
     * @param {String} [event] The event name
     */
    function clearListeners(event) {
        /*jshint validthis:true*/
        if (event) {
            if (this._firing) {
                this._listeners[event].length = 0;
            } else {
                delete this._listeners[event];
            }
        } else {
            if (this._firing) {
                for (var key in this._listeners) {
                    this._listeners[key].length = 0;
                }
            } else {
                this._listeners = {};
            }
        }
    }

    // Export some control functions that are used internally
    // They could be useful to be used by others
    MixableEventsEmitter.getListenerIndex = getListenerIndex;
    MixableEventsEmitter.clearListeners = clearListeners;

    return MixableEventsEmitter;
});
