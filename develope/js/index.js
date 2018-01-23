console.log('Hello from index.js');
const css = require('../scss/index.scss');
import React from 'react';
import ReactDOM from 'react-dom';
import {
    App
} from './modules/App';

ReactDOM.render( <
    App / > ,
    document.getElementById('root')
)