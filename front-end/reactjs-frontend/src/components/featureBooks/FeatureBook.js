import React from "react";
import { Button } from "../button/Button";
import CardFeature from "./CardFeature";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./FeatureBook.css";

function FeatureBook() {
	return (
		<div className="feature-book__container">
			<div className="heading-feature-book">
				<h1>Featured Books</h1>
				<div className="button-nav">
					<Button
						type="button"
						buttonStyle="btn--primary"
						buttonSize="btn--medium"
						path="/recommended"
					>
						Recommended
					</Button>
					<Button
						type="button"
						buttonStyle="btn--primary"
						buttonSize="btn--medium"
						path="/popular"
					>
						Popular
					</Button>
				</div>
			</div>
			<div className="content-cards">
				<CardFeature />
			</div>
		</div>
	);
}

export default FeatureBook;
