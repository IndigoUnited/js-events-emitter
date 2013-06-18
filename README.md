EventsEmitter
---

Simple library that allows to listen and emit events.
It is built on top of [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD).



## API

Optional parameters are prefixed with an $.

### EventsEmitter#on(event, fn, $context)

Register an `event` listener `fn` (with the option to pass a `$context`).
Duplicate listeners are discarded.


### EventsEmitter#once(event, fn, $context)

Register an `event` listener `fn` that runs only once (with the option to pass a `$context`).
Duplicate listeners are discarded.

### EventsEmitter#off($event, $fn, $context)

Remove `event` listener `$fn` that was added with `$context`.
If no `$fn` is passed, removes all listeners for `$event` or all the emitter listeners if no `$event` is passed.


### EventsEmitter#has(event, $fn)

Checks if the listener `$fn` for event `event` is registered.
If no `$fn` is passed, returns true if at least one listener is registered for `event`.


### EventsEmitter#emit(event, ...)

Emit an `event` with variable option args.


### EventsEmitter#forEach(fn, $context)

Cycles through all the events and its listeners.
Calls `fn` with `$context` foreach iteration.



## Tests

1. `bower install`
2. `npm install`
3. `npm test`

You will need [bower](https://github.com/bower/bower) to install the library dev dependencies.



## How to use

For now, this library is only available in the [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) format.

If you use RequireJS specify them like this:

```js
// ...
paths : {
   'events-emitter': '../components/events-emitter/src'
}
// ...
```

Note that if you want to support `IE8` you will need to install [es5-shim](https://github.com/kriskowal/es5-shim.git) and require both `es5-shim` and `es5-sham` with your AMD loader before requiring this library.



## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
