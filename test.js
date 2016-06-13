define(['jquery'], function x($) {
    $('#container').text('Hello, world! This is executed using a ' +
                         'little module loader called AMDCDN. jQuery ' +
                         'is pulled from jsDelivr dynamically through ' +
                         'a define call. The code (pulled directly ' +
                         'from the server) is shown below.');
    $('#container').css('color', 'blue');

    const code = $('<code></code>');
    code.load('test.js', function() {
        this.innerText = this.innerHTML;
    });
    $('#container').append($('<pre></pre>').append(code));
});