import React, { useState } from "react";
import CardItem from "../cards/CardItem";
import { Pagination, Row } from "react-bootstrap";
// import JsonData from "./fakeData.json";
// import { ReactPaginate } from "react-paginate";
function CardData() {
	const rtn = [
		{
			id: 1,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 2,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 3,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 4,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 5,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 6,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 7,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 8,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 9,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 10,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 11,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 12,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 13,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 14,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 15,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
		{
			id: 16,
			title: "Book Title",
			subTitle: "Sub Title",
			price: "price",
			imgUrl: "images/pic.jpg",
		},
	];
	return rtn;
}
function BooksList() {
	// const cardData = CardData();
	// eslint-disable-next-line
	const [cardData, setCardData] = useState(CardData().slice(0, 16));
	const [selected, setSelected] = useState(0);
	let active = 1;
	let items = [];
	const booksPerPage = 10;
	const pagesVisited = selected * booksPerPage;
	const displayBooks = cardData
		.slice(pagesVisited, pagesVisited + booksPerPage)
		.map((card, i) => {
			return (
				<CardItem
					path={"/shop/" + card.id}
					key={i}
					src={card.imgUrl}
					title={card.title}
					subTitle={card.subTitle}
					price={card.price}
				/>
			);
		});
	const pageCount = Math.ceil(cardData.length / booksPerPage);
	for (let number = 1; number <= pageCount; number++) {
		items.push(
			<Pagination.Item key={number} active={number === active}>
				{number}
			</Pagination.Item>
		);
	}
	// const changePage = (selected) => {
	// 	setActive(selected);
	// };
	return (
		<>
			<Row xs={1} md={4} className="g-4">
				{displayBooks}
			</Row>
			<Pagination
				style={{
					display: "flex",
					justifyContent: "center",
					margin: "20px 0",
				}}
			>
				{items}
			</Pagination>
		</>
	);
}

export default BooksList;
