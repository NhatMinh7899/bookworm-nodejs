import React from "react";
// eslint-disable-next-line
import { Button } from "../button/Button";
import Card from "../cards/Card";
import { Carousel } from "react-bootstrap";
import "./OnSalesSession.css";

function OnSalesSession() {
	return (
		<>
			<div className="heading">
				<h3>On Sales</h3>
				<Button path="/view-all">View All</Button>
			</div>
			<div className="">
				<Carousel>
					<Carousel.Item>
						<Card />
					</Carousel.Item>
					<Carousel.Item>
						<Card />
					</Carousel.Item>
				</Carousel>
			</div>
		</>
	);
}

export default OnSalesSession;
