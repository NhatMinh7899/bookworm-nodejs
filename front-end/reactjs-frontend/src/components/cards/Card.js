import React from "react";
import CardItem from "./CardItem";
import { Row } from "react-bootstrap";
// import "./Card.css";

function Card() {
	return (
		<Row xs={1} md={4} className="g-4">
			<CardItem
				src="images/pic.jpg"
				title="Title"
				subTitle="Sub Title"
				price="price"
				path="/items1"
			/>
			<CardItem
				src="images/pic.jpg"
				title="Title"
				subTitle="Sub Title"
				price="price"
				path="/items1"
			/>
			<CardItem
				src="images/pic.jpg"
				title="Title"
				subTitle="Sub Title"
				price="price"
				path="/items1"
			/>
			<CardItem
				src="images/pic.jpg"
				title="Title"
				subTitle="Sub Title"
				price="price"
				path="/items1"
			/>
		</Row>
	);
}

export default Card;
