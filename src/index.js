import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.js'
import './i18n'
import 'bootstrap/dist/css/bootstrap.min.css'
import { disableReactDevTools } from '@fvilers/disable-react-devtools' 

if (process.env.NODE_ENV === 'production') disableReactDevTools();

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);