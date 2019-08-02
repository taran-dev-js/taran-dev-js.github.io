import React from 'react'
import { Viewer } from './components/viewer'
import { Header } from './components/header'


function App () {
	return (
		<main className="App">
			<div className="container-fluid">
				<Header count={0}/>
				<Viewer/>
			</div>
		</main>
	)
}

export default App
