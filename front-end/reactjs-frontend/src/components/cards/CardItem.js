import React from "react";
import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
// import "./CardItem.css";

function CardItem(props) {
	return (
		<Col>
			<Link className="link" to={props.path}>
				<Card style={{ marginTop: "18px" }}>
					<Card.Img variant="top" src={props.src} />
					<Card.Body>
						<Card.Title>{props.title}</Card.Title>
						<Card.Text>{props.subTitle}</Card.Text>
					</Card.Body>
					<Card.Header>{props.price}</Card.Header>
				</Card>
			</Link>
		</Col>
	);
}

export default CardItem;
