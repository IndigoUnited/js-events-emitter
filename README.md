# EventsEmitter #
---

Simple library that allows to listen and emit events.
It is built on top of [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD).



## API ##

Optional parameters are prefixed with an $.

### EventsEmitter#on(event, fn, $context) ###

Register an `event` listener `fn` (with the option to pass a `$context`).
Duplicate listeners are discarded.


### EventsEmitter#on(event, fn, $context) ###

Register an `event` listener `fn` that runs only once (with the option to pass a `$context`).
Duplicate listeners are discarded.

### EventsEmitter#off($event, $fn, $context) ###

Remove `event` listener `$fn` that was added with `$context`.
If no `$fn` is passed, removes all listeners for `$event` or all the emitter listeners if no `$event` is passed.


### EventsEmitter#has(event, $fn) ###

Checks if the listener `$fn` for event `event` is registered.
If no `$fn` is passed, returns true if at least one listener is registered for `event`.


### EventsEmitter#emit(event, ...) ###

Emit an `event` with variable option args.


### EventsEmitter#forEach(fn, $context) ###

Cycles through all the events and its listeners.
Calls `fn` with `$context` foreach iteration.



## Testing ##

The tests are built on top of [mocha](http://visionmedia.github.com/mocha/) test framework and the [expect.js](https://github.com/LearnBoost/expect.js) assert library.

First run `npm install` and `bower install` to install all the tools needed.
Then simply open the `test/tester.html` file in the browser.

### Run in node ###

Type `"node_modules/.bin/mocha"` to run the tests.
You can also run the tests by doing `npm run-script test`.

_Tip_: You can use the `-R list` option to print the full tests list.


### Run in the browser ###

To run them simply open the `test/tester.html` file in the browser.



## Dependencies ##

EventsEmitter depends on [amd-utils](https://github.com/millermedeiros/amd-utils) and [dejavu](https://github.com/IndigoUnited/dejavu)
If you use RequireJS specify them like this:

```js
    paths : {
        'amd-utils': '../vendor/amd-utils/src',
        'dejavu': '../vendor/dejavu/dist/amd/strict'  // use the loose version in production
    },
```



## License ##

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).