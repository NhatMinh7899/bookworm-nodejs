import React from "react";
import { Container } from "react-bootstrap";
import "../../App.css";
import FeatureBook from "../featureBooks/FeatureBook";
import OnSalesSession from "../onSales/OnSalesSession";

function Home() {
	return (
		<>
			<Container>
				<OnSalesSession />
				<FeatureBook />
			</Container>
		</>
	);
}

export default Home;
