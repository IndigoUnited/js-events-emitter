/**
 * MixableEventsEmitter.
 * This is an abstract class because it is meant to be mixed in and not used as a standalone class.
 * This was necessary because the fireEvent had to be declared protected.
 */
define(function () {

    'use strict';

    var hasOwn = Object.prototype.hasOwnProperty,
        slice = Array.prototype.slice,
        parseEventResult = {};

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
        var parsed = parseEvent(event, true);

        registerListener.call(this, {
            name: parsed.name,
            ns: parsed.ns,
            fn: fn,
            callable: fn,
            context: context
        });

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
        var callable,
            meta,
            that = this,
            parsed;

        callable = function () {
            unregisterListener.call(that, meta);
            fn.apply(this, arguments);
        };

        parsed = parseEvent(event, true);

        meta = {
            name: parsed.name,
            ns: parsed.ns,
            fn: fn,
            callable: callable,
            context: context
        };

        registerListener.call(this, meta);

        return this;
    };

    // Alias to once()
    MixableEventsEmitter.prototype.one = MixableEventsEmitter.prototype.once;

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
        var listeners,
            index,
            curr,
            x,
            parsed;

        // off()
        if (!event) {
            cleanListeners.call(this);
            return this;
        }

        parsed = parseEvent(event, true);

        // Get the listeners array based on the name / namespace
        this._listeners = this._listeners || {};
        this._namespaces = this._namespaces || {};

        listeners = parsed.name ? this._listeners[parsed.name] : this._namespaces[parsed.ns];

        if (!listeners) {
            return this;
        }

        // If a specific fn was passed, remove just that
        // .off(name, fn)
        // .off(name, fn, ctx)
        // .off(name.namespace, fn)
        // .off(name.namespace, fn, ctx)
        if (fn) {
            index = getListenerIndex(listeners, fn, context);

            if (index !== -1) {
                unregisterListener.call(this, listeners[index]);
            }

            return this;
        }

        // Remove all listeners of the given name / namespace
        // Unroll the loop for performance reasons
        // .off(name)
        // .off(name.namespace)
        if (!parsed.ns) {
            for (x = listeners.length - 1; x >= 0; x -= 1) {
                curr = listeners[x];

                if (hasOwn.call(curr, 'fn')) {
                    unregisterListener.call(this, curr);
                }
            }
        } else {
            for (x = listeners.length - 1; x >= 0; x -= 1) {
                curr = listeners[x];

                if (curr.ns === parsed.ns) {
                    unregisterListener.call(this, curr);
                }
            }
        }

        return this;
    };

    /////////////////////////////////////////////////////////////////////////////////////

    /**
     * Emits an event.
     *
     * @param {String}   event  The event name
     * @param {...mixed} [args] The arguments to pass along with the event
     *
     * @return {MixableEventsEmitter} The instance itself to allow chaining
     */
    MixableEventsEmitter.prototype._emit = function (event) {
        var listeners,
            params,
            x,
            curr,
            wasFiring;

        this._listeners = this._listeners || {};
        listeners = this._listeners[event];

        if (listeners) {
            params = slice.call(arguments, 1);
            wasFiring = this._firing;
            this._firing = true;

            for (x = 0; x < listeners.length; x += 1) {
                curr = listeners[x];

                // Check if the listener has been deleted meanwhile
                if (hasOwn.call(curr, 'fn')) {
                    curr.callable.apply(curr.context || this, params);
                } else {
                    listeners.splice(x, 1);
                    x -= 1;
                }
            }

            if (listeners.length === 0) {
                delete this._listeners[event];
            }

            this._firing = wasFiring;
        }

        return this;
    };

    // Alias to _emit()
    MixableEventsEmitter.prototype._trigger = MixableEventsEmitter.prototype._emit;

    /////////////////////////////////////////////////////////////////////////////////////

    /**
     * Gets a listener index.
     *
     * @param {String}   listeners The listeners array
     * @param {Function} fn        The function
     * @param {Object}   [context] The context passed to the on() function
     *
     * @return {Number} The index of the listener if found or -1 if not found
     */
    function getListenerIndex(listeners, fn, context) {
        var x,
            curr;

        for (x = listeners.length - 1; x >= 0; x -= 1) {
            curr = listeners[x];
            if (curr.fn === fn && curr.context === context) {
                return x;
            }
        }

        return -1;
    }

    /**
     * Registers a listener.
     *
     * @param {Object} The listener metadata
     */
    function registerListener(meta) {
        /*jshint validthis:true*/
        var listeners,
            name = meta.name,
            ns = meta.ns;

        this._listeners = this._listeners || {};
        listeners = this._listeners[name] = this._listeners[name] || [];

        if (getListenerIndex(listeners, meta.fn, meta.context) === -1) {
            listeners.push(meta);

            // Add also to namespace
            if (ns) {
                this._namespaces = this._namespaces || {};
                listeners = this._namespaces[ns] = this._namespaces[ns] || [];
                listeners.push(meta);
            }
        }
    }

    /**
     * Unregisters a listener.
     *
     * @param {Object} The listener metadata
     */
    function unregisterListener(meta) {
        /*jshint validthis:true*/
        var index,
            listeners,
            name = meta.name,
            ns = meta.ns;

        // Remove from the listeners array
        listeners = this._listeners[name];
        index = getListenerIndex(listeners, meta.fn, meta.context);
        if (index !== -1) {
            if (!this._firing) {
                listeners.splice(index, 1);
                if (!listeners.length) {
                    delete this._listeners[name];
                }
            } else {
                listeners[index] = {};
            }
        }

        // Remove also from the namespace array
        listeners = this._namespaces && this._namespaces[ns];
        if (!listeners) {
            return;
        }

        index = getListenerIndex(listeners, meta.fn, meta.context);
        if (index !== -1) {
            listeners.splice(index, 1);
            if (!listeners.length) {
                delete this._namespaces[ns];
            }
        }
    }

    /**
     * Cleans all the listeners.
     */
    function cleanListeners() {
        /*jshint validthis:true*/
        var key;

        this._namespaces = {};

        if (!this._firing) {
            this._listeners = {};
        } else {
            for (key in this._listeners) {
                this._listeners[key].length = 0;
            }
        }
    }

    /**
     * Parses an event, extracting its name and namespace.
     * They will be available in the "name" and "ns" namespace.
     * If you want an object returned, pass "ret" as true.
     *
     * @param {String} event  The event name
     * @param {Boolean} [reuse] Re-use the same object to avoid creating too much objects, defaults to true
     *
     * @return {Object} The parsed event
     */
    function parseEvent(event, reuse) {
        var split,
            ret = reuse ? parseEventResult : {};

        if (event == null) {
            return null;
        }

        split = event.split('.');
        ret.name = split[0];
        ret.ns = split[1];

        return ret;
    }

    // Export some control functions that are used internally
    // They could be useful to be used by others
    MixableEventsEmitter.getListenerIndex = getListenerIndex;
    MixableEventsEmitter.parseEvent = parseEvent;

    return MixableEventsEmitter;
});
