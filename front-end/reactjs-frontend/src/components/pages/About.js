import React from "react";
import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";

function About() {
	return (
		<Container>
			<h2 className="headingLine">About</h2>
			<div className="contentAbout">
				<div className="contentTop">
					<h2>Welcome to BOOKWORM</h2>
					<div className="content">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</div>
				</div>
				<div className="contentBottom">
					<div className="contentBottomLeft">
						<h4>Our Story</h4>
						<div className="content">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat.
						</div>
					</div>
					<div className="contentBottomRight">
						<h4>Our Vision</h4>
						<div className="content">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat.
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
}

export default About;
