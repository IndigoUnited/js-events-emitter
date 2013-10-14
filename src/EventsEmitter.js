/**
 * EventsEmitter.
 * This class is equal to its base one but exposes the fireEvent method.
 */
define([
    './MixableEventsEmitter'
], function (MixableEventsEmitter) {

    'use strict';

    var getListenerIndex = MixableEventsEmitter.getListenerIndex;

    function EventsEmmiter() {}

    EventsEmmiter.prototype = Object.create(MixableEventsEmitter.prototype);
    EventsEmmiter.prototype.constructor = EventsEmmiter;

    /**
     * Emits an event.
     *
     * @param {String}   event The event name
     * @param {...mixed} [args] The arguments to pass along with the event
     *
     * @return {EventsEmitter} The instance itself to allow chaining
     */
    EventsEmmiter.prototype.emit = function () {
        return this._emit.apply(this, arguments);
    };

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
    EventsEmmiter.prototype.has = function (event, fn, context) {
        var events,
            x;

        this._listeners = this._listeners || {};

        if (!fn) {
            events = this._listeners[event];
            if (!this._firing) {
                return !!events;
            } else {
                for (x = (events ? events.length : 0) - 1; x >= 0; x -= 1) {
                    if (events[x].fn) {
                        return true;
                    }
                }

                return false;
            }
        } else {
            return getListenerIndex.call(this, event, fn, context) !== -1;
        }

        return this;
    };

    /**
     * Cycles through all the events and its listeners.
     * The function will receive the event name and the handler for each iteration.
     *
     * @param {Function} fn        The function to be called for each iteration
     * @param {Object}   [context] The context to be used while calling the function, defaults to the instance
     *
     * @return {EventsEmmiter} The instance itself to allow chaining
     */
    EventsEmmiter.prototype.forEach = function (fn, context) {
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

    return EventsEmmiter;
});
