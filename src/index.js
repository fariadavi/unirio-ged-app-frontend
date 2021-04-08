import React from 'react'
import ReactDOM from 'react-dom'
import './i18n'
import App from './components/App.js'
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);