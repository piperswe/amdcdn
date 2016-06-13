# AMDCDN
## Proof-of-concept

An AMD module loader that can load modules from a CDN

# Usage

> TODO: add to jsDelivr

# Building for browser

Requires Node.js and npm to be installed.

    npm run build

# Testing

There is currently no formal test suite, but chances are things are working if
`index.html` shows the following message:

> Hello, world! This is executed using a little module loader called AMDCDN. jQuery is pulled from jsDelivr dynamically through a define call. The code (pulled directly from the server) is shown below.
> 
>     define(['jquery'], function x($) {
>         $('#container').text('Hello, world! This is executed using a ' +
>                              'little module loader called AMDCDN. jQuery ' +
>                              'is pulled from jsDelivr dynamically through ' +
>                              'a define call. The code (pulled directly ' +
>                              'from the server) is shown below.');
>         $('#container').css('color', 'blue');
>     
>         const code = $('<code></code>');
>         code.load('test.js', function() {
>             this.innerText = this.innerHTML;
>         });
>         $('#container').append($('<pre></pre>').append(code));
>     });

Be sure you are using a web server such as `python -m SimpleHTTPServer`.