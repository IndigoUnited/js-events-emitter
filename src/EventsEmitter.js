/**
 * EventsEmitter.
 * This class is equal to its base one but exposes the fireEvent method.
 */
define([
    './MixableEventsEmitter'
], function (MixableEventsEmitter) {

    'use strict';

    var getListenerIndex = MixableEventsEmitter.getListenerIndex,
        parseEvent = MixableEventsEmitter.parseEvent;

    function EventsEmiter() {}

    EventsEmiter.prototype = Object.create(MixableEventsEmitter.prototype);
    EventsEmiter.prototype.constructor = EventsEmiter;

    /**
     * Emits an event.
     *
     * @param {String}   event The event name
     * @param {...mixed} [args] The arguments to pass along with the event
     *
     * @return {EventsEmitter} The instance itself to allow chaining
     */
    EventsEmiter.prototype.emit = MixableEventsEmitter.prototype._emit;
    EventsEmiter.prototype.trigger = MixableEventsEmitter.prototype._trigger;

    /**
     * Check if a listener is attached to a given event name.
     * If no function is passed, it will check if at least one listener is attached.
     *
     * @param {String}   event     The event name
     * @param {Function} [fn]      The listener
     * @param {Object}   [context] The context passed to the on() function
     *
     * @return {Boolean} True if it is attached, false otherwise
     */
    EventsEmiter.prototype.has = function (event, fn, context) {
        var listeners,
            x,
            parsed;

        parsed = parseEvent(event, true);

        // Get the listeners array based on the name / namespace
        this._listeners = this._listeners || {};
        this._namespaces = this._namespaces || {};

        listeners = parsed.name ? this._listeners[parsed.name] : this._namespaces[parsed.ns];

        if (!listeners) {
            return false;
        }

        if (!fn) {
            // Cycle through the array until we find a valid listener
            // This is needed because it might contain "junk" listeners (already removed)
            for (x = listeners.length - 1; x >= 0; x -= 1) {
                if (listeners[x].fn) {
                    return true;
                }
            }

            return false;
        }

        return getListenerIndex(listeners, fn, context) !== -1;
    };

    /**
     * Cycles through all the event listeners.
     * The function will receive the event name, handler and context for each iteration.
     *
     * You SHOULD NOT remove any listeners while doing so, it will have UNEXPECTED BEHAVIOR.
     *
     * @param {Function} fn        The function to be called for each iteration
     * @param {Object}   [context] The context to be used while calling the function, defaults to the instance
     *
     * @return {EventsEmiter} The instance itself to allow chaining
     */
    EventsEmiter.prototype.forEach = function (fn, context) {
        var key,
            x,
            length,
            currEvent,
            curr;

        this._listeners = this._listeners || {};
        context = context || this;

        for (key in this._listeners) {
            currEvent = this._listeners[key];

            length = currEvent.length;
            for (x = 0; x < length; x += 1) {
                curr = currEvent[x];
                if (curr.fn) {
                    fn.call(context, key, curr.fn, curr.context);
                }
            }
        }
    };

    /**
     * Cycles through all the events meta.
     * The function will receive the event meta for each iteration.
     *
     * The event meta contains the event name, namespace, function and other useful stuff used inside.
     * You SHOULD NOT remove any listeners while doing so, it will have UNEXPECTED BEHAVIOR.
     *
     * @param {Function} fn        The function to be called for each iteration
     * @param {Object}   [context] The context to be used while calling the function, defaults to the instance
     *
     * @return {EventsEmiter} The instance itself to allow chaining
     */
    EventsEmiter.prototype.forEachMeta = function (fn, context) {
        var key,
            x,
            length,
            currEvent,
            curr;

        this._listeners = this._listeners || {};
        context = context || this;

        for (key in this._listeners) {
            currEvent = this._listeners[key];

            length = currEvent.length;
            for (x = 0; x < length; x += 1) {
                curr = currEvent[x];
                if (curr.fn) {
                    fn.call(context, curr);
                }
            }
        }
    };

    return EventsEmiter;
});
