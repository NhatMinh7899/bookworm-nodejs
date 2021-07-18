import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavbarComponent() {
	return (
		<>
			<Navbar variant="light" bg="light">
				<Container>
					<Link to="/" className="nav-link">
						<h3 className="text-uppercase">bookform</h3>
					</Link>
					<Nav className="me-auto">
						<Link to="/" className="nav-link">
							Home
						</Link>
						<Link to="/shop" className="nav-link">
							Shop
						</Link>
						<Link to="/about" className="nav-link">
							About
						</Link>
						<Link to="/cart" className="nav-link">
							Cart(0)
						</Link>
					</Nav>
				</Container>
			</Navbar>
		</>
	);
}

export default NavbarComponent;
