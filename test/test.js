if (!global.evaluated) {
    require('./util/adapter.js');
}

// As of requirejs 2.1 requirejs is also async in node
// But if we call it directly by id it has sync behavior
if (!global.browser) {
    define('specs/basic');
} else {
    define(['specs/basic']);
}