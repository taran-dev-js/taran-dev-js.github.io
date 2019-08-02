import React from 'react'

export const Header = ({ count }) => {
	return (
		<header className="header">
			<h1 className="header__title">Count of people: {count}</h1>
		</header>
	)
}