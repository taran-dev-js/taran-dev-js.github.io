import React from 'react'
import './styles.scss'

export const Button = ({ text }) => (
	<button type="button" className="button">
		{text}
	</button>
)