define('changeColors', ['d3js@3.5.17'], function () {
    return function () {
        d3.selectAll('*').style('color', () =>
            `hsl(${Math.random() * 360},100%,50%)`
        );
    }
});

define(['jquery@3.0.0', 'd3js@3.5.17', 'changeColors'], function ($, _, changeColors) {
    $('#container').text('Hello, world! This is executed using a ' +
        'little module loader called AMDCDN. jQuery ' +
        'is pulled from jsDelivr dynamically through ' +
        'a define call. The code (pulled directly ' +
        'from the server) is shown below.');

    const code = $('<code></code>');
    code.load('test.js', function () {
        this.innerText = this.innerHTML;
    });
    $('#container').append($('<pre></pre>').append(code));

    changeColors();
});