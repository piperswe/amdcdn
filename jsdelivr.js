import deepFreeze from './deep-freeze';

export const jsdelivr = deepFreeze({
    jquery: {
        '3.0.0': 'https://cdn.jsdelivr.net/jquery/3.0.0/jquery.min.js',
        '2.2.4': 'https://cdn.jsdelivr.net/jquery/2.2.4/jquery.min.js',
        '2.1.4': 'https://cdn.jsdelivr.net/jquery/2.1.4/jquery.min.js',
        '2.0.3': 'https://cdn.jsdelivr.net/jquery/2.0.3/jquery.min.js',
        '1.12.4': 'https://cdn.jsdelivr.net/jquery/1.12.4/jquery.min.js',
        '1.11.3': 'https://cdn.jsdelivr.net/jquery/1.11.3/jquery.min.js',
        '1.10.2': 'https://cdn.jsdelivr.net/jquery/1.10.2/jquery.min.js',
        '1.9.1': 'https://cdn.jsdelivr.net/jquery/1.9.1/jquery.min.js',
        '1.8.3': 'https://cdn.jsdelivr.net/jquery/1.8.3/jquery.min.js',
        '1.7.2': 'https://cdn.jsdelivr.net/jquery/1.7.2/jquery.min.js',
        '1.5.1': 'https://cdn.jsdelivr.net/jquery/1.5.1/jquery.min.js',
        '1.4.4': 'https://cdn.jsdelivr.net/jquery/1.4.4/jquery.min.js'
    },
    react: {
        '15.1.0': 'https://cdn.jsdelivr.net/react/15.1.0/react.min.js',
        '15.0.2': 'https://cdn.jsdelivr.net/react/15.0.2/react.min.js',
        '0.14.7': 'https://cdn.jsdelivr.net/react/0.14.7/react.min.js',
        '0.13.3': 'https://cdn.jsdelivr.net/react/0.13.3/react.min.js',
        '0.12.2': 'https://cdn.jsdelivr.net/react/0.12.2/react.min.js',
        '0.11.2': 'https://cdn.jsdelivr.net/react/0.11.2/react.min.js',
        '0.10.0': 'https://cdn.jsdelivr.net/react/0.10.0/react.min.js',
        '0.9.0': 'https://cdn.jsdelivr.net/react/0.9.0/react.min.js',
        '0.8.0': 'https://cdn.jsdelivr.net/react/0.8.0/react.min.js'
    },
    'react-dom': {
        '15.1.0': 'https://cdn.jsdelivr.net/react/15.1.0/react-dom.min.js',
        '0.14.7': 'https://cdn.jsdelivr.net/react/0.14.7/react-dom.min.js'
    },
    // TODO: Some automated way to add more packages
});