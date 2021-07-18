import React from "react";
import "../../App.css";
import { Container } from "react-bootstrap";
import BooksList from "../cards/BooksList";

function Shop() {
	return (
		<Container>
			<h3 className="headingLine">Books</h3>
			<div className="contentShop">
				<div className="contentFilter">
					<h6>Filter by</h6>
				</div>
				<div className="contentBooks">
					<BooksList />
				</div>
			</div>
		</Container>
	);
}

export default Shop;
