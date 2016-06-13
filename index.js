/*
Copyright (c) 2016 Zebulon McCorkle

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const DEBUG = false;
function debug(...args) {
    if (DEBUG) {
        debug(...args);
    }
}

import { resolve as resolveSemver } from './node_modules/u-semver/src/u-semver.js';

// Regex from https://github.com/requirejs/requirejs/blob/master/require.js#L15
const commentRegex = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
// Regex from https://github.com/requirejs/requirejs/blob/9d95c7bf2b0e83e44cf7d0dbce1118f64ee4a302/require.js#L16
const requireRegex = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;

const modules = new Map();
const moduleListeners = new Map();
const donotload = [];
let lastDefined = null;

/**
 * @returns {name, range} if local, {url, name, range} if on CDN
 */
function resolve(module) {
    const split = module.split('@');
    const name = split[0];
    const range = split[1] || 'latest';
    if (localStorage.getItem(`amdcdn:${name}`) != null) {
        return Promise.resolve(JSON.parse(localStorage.getItem(`amdcdn:${name}`)));
    }
    return fetch(`http://api.jsdelivr.com/v1/jsdelivr/libraries?name=${name}`)
        .then(response => response.json())
        .then(result => {
            if (result.length === 1) {
                const library = result[0];
                let version;
                try {
                    version = resolveSemver(range, library.versions);
                } catch (exception) {
                    // If the library doesn't use semver
                    version = split[1] || library.versions[0];
                }
                const assets = library.assets.filter(x => x.version === version)[0];
                return { name, range, url: `https://cdn.jsdelivr.net/${name}/${version}/${assets.mainfile}` };
            } else {
                return { name, range };
            }
        }).then(resolved => {
            localStorage.setItem(`amdcdn:${name}`, JSON.stringify(resolved));
            return resolved;
        });
}

function listen(module) {
    if (modules.get(module) != null) {
        return Promise.resolve(modules.get(module));
    }
    if (moduleListeners.get(module) == null) {
        moduleListeners.set(module, []);
    }
    const listeners = moduleListeners.get(module);
    return new Promise(function (resolve, reject) {
        listeners.push(resolve);
    });
}

function map(arr, fun) {
    let promise = Promise.resolve();
    const res = [];
    for (let i of arr) {
        promise = promise.then(x => {
            res.push(x);
            return fun(i);
        });
    }
    return promise.then(x => {
        res.push(x);
        return res;
    });
}

export default function define(a, b, c) {
    let id = '_module' + modules.size, dependencies = [], factory;
    if (b == null && c == null) {
        if (typeof a !== 'function' && typeof a !== 'object') {
            throw new TypeError('factory must be a function or object');
        } else {
            factory = a;
        }
    } else if (c == null) {
        if (typeof a === 'string') {
            id = a;
        } else if (a instanceof Array) {
            dependencies = a;
        } else {
            throw new TypeError('first argument must be a string or array');
        }
        if (typeof b !== 'function' && typeof b !== 'object') {
            throw new TypeError('factory must be a function or object');
        }
        factory = b;
    } else {
        if (typeof a !== 'string') {
            throw new TypeError('id must be a string');
        } else if (!(b instanceof Array)) {
            throw new TypeError('dependencies must be an array');
        } else if (typeof c !== 'function' && typeof c !== 'object') {
            throw new TypeError('factory must be a function or object');
        }
        id = a;
        dependencies = b;
        factory = c;
    }

    donotload.push(id);
    lastDefined = id;

    /*
    // TODO: CommonJS wrapping
    factory.toString()
        // Function from https://github.com/requirejs/requirejs/blob/9d95c7bf2b0e83e44cf7d0dbce1118f64ee4a302/require.js#L40
        .replace(commentRegex, (_, __, ___, singlePrefix) => singlePrefix || '')
        .replace(requireRegex, (_, dependency) => dependencies.push(dependency));
    */

    Promise.all(dependencies.map(dep => resolve(dep)
        .then(resolved => {
            debug('donotload', donotload, 'id', id);
            if (resolved.url && !donotload.includes(dep)) {
                const element = document.createElement('script');
                element.addEventListener('load', function () {
                    debug('lastDefined', lastDefined, 'id', dep);
                    modules.set(resolved.name, modules.get(lastDefined));
                    (moduleListeners.get(resolved.name) || (debug(dep), [])).forEach(x => x(modules.get(dep)));
                });
                element.src = resolved.url;
                element.async = false; // TODO: figure out how to make this not async
                donotload.push(dep);
                document.body.appendChild(element);
            }
            return listen(resolved.name);
        })
    )).then(resolved => {
        debug('resolved', resolved, 'id', id);
        debug('dependencies', dependencies, 'id', id);
        debug('a', a, 'b', b, 'c', c, 'id', id);
        if (typeof factory === 'object') {
            modules.set(id, factory);
        } else {
            modules.set(id, factory(...resolved));
        }
        debug(`%cAMDCDN: Loaded ${id}`, 'color: lightgreen;')
        const listeners = moduleListeners.get(id);
        if (listeners instanceof Array) {
            listeners.forEach(x => x(modules.get(id)));
        }
    });
}
define.amd = {
    cdn: true,
    commonjs: false
};