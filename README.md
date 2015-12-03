# EventsEmitter [![Build Status](https://secure.travis-ci.org/IndigoUnited/js-events-emitter.png?branch=master)](http://travis-ci.org/IndigoUnited/js-events-emitter)

Simple library that allows to listen and emit events.



## API

### .on(event, fn, [context])

Register an `event` listener `fn` (with the option to pass a `context`).   
Duplicate listeners are discarded.

You can specify the event namespace by separating it with a `.`.
For instance the event `click.foo` has a name of `click` and a namespace of `foo`.
This allows you to easily remove a namespace of events with `off('.foo')` or `off('click.foo')`.


### .once(event, fn, [context])

Register an `event` listener `fn` that runs only once (with the option to pass a `context`).   
Duplicate listeners are discarded.


### .off([event], [fn], [context])

Remove `event` listener `fn` that was added with `context`.   
If no `fn` is passed, removes all listeners for `event` or all listeners if no `event` is passed.

You can remove events using namespaces. Bellow is a list of all the supported `event` signatures:

- `.off('click', handler)` - Removes the specific `handler` from the `click` event with no context
- `.off('click', handler, context)` - Removes the specific `handler` from the `click` event with the specified `context`
- `.off('click.foo')` - Removes all the `click` handlers that were added with `click.foo`
- `.off('.foo')` - Removes all the events that were added with `xx.foo` where `xx` are arbitrary event names


### .has(event, [fn])

Checks if the listener `fn` for event `event` is registered.
If no `fn` is passed, returns true if at least one listener is registered for `event`.

Namespaces are allowed empowering you with the ability to check for the presence of listeners in a particular namespace.


### .emit(name, ...)

Emit an event named `name` with variable option args.


### .forEach(fn, [context])

Cycles through all the event listeners.
Calls `fn` with `context` foreach iteration.

The `context` function will be called with `name`, `fn` and `context`.
You SHOULD NOT remove any listeners while doing so, it will have UNEXPECTED BEHAVIOR.


### .forEachMeta(fn, [context])

Cycles through all the event listeners meta.
Calls `fn` with `context` foreach iteration.
This is similar to .forEach but gives much more information about each listener.

The `context` function will be called with `meta` which is an object containing the `name`, `fn`, `context` and other useful information.
You SHOULD NOT remove any listeners while doing so, it will have UNEXPECTED BEHAVIOR.


## How to use

For now, this library is only available in the [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) format.

If you use RequireJS specify them like this:

```js
// ...
paths : {
   'events-emitter': '../bower_components/events-emitter/src'
}
// ...
```

Note that if you want to support `IE8` or lower you will need to install [es5-shim](https://github.com/kriskowal/es5-shim.git) and require both `es5-shim` and `es5-sham` with your AMD loader before requiring this library.



## Tests

1. `bower install`
2. `npm install`
3. `npm test`

You will need [bower](https://github.com/bower/bower) to install the library dev dependencies.



## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
