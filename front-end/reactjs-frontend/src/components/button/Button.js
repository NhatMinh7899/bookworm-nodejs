import React from "react";
// import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Button.css";

const STYLES = ["btn--primary", "btn--outline", "btn--icon"];

const SIZES = ["btn--medium", "btn--small", "btn--large"];

export const Button = ({
	children,
	type,
	onClick,
	buttonStyle,
	buttonSize,
	...props
}) => {
	const checkButtonStyle = STYLES.includes(buttonStyle)
		? buttonStyle
		: STYLES[0];
	const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

	return (
		<Link to={props.path}>
			<button
				className={`btn ${checkButtonStyle} ${checkButtonSize}`}
				onClick={onClick}
				type={type}
			>
				{children}
			</button>
		</Link>
	);
};
