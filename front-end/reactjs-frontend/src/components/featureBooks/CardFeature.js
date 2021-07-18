import React from "react";
import { Row } from "react-bootstrap";
import CardItem from "../cards/CardItem";

function CardData() {
	const rtn = [
		{
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
	];
	return rtn;
}

function CardFeature() {
	const cardData = CardData();
	return (
		<div className="cards">
			<Row xs={1} md={4} className="g-4">
				{cardData.map((card, i) => {
					return (
						<CardItem
							key={i}
							src={card.imgUrl}
							title={card.title}
							subTitle={card.subTitle}
							price={card.price}
						/>
					);
				})}
			</Row>
		</div>
	);
}

export default CardFeature;
