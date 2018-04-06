import React from 'react';
import ReactDOM from 'react-dom';
import Shell from './components/Shell';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Shell />, document.getElementById('root'));
registerServiceWorker();
