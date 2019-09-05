import React from 'react'

export const Header = ({count}) => {
	return (
		<header>
			<div className="container-fluid">
				<p>find people: {count}</p>
			</div>
		</header>
	)
}