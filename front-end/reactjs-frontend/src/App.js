import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Home from "./components/pages/Home";
import Shop from "./components/pages/Shop";
import About from "./components/pages/About";
import Cart from "./components/pages/Cart";

function App() {
	return (
		<>
			<Router className="container">
				<Navbar />
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/shop" exact component={Shop} />
					<Route path="/about" exact component={About} />
					<Route path="/cart" exact component={Cart} />
				</Switch>
				<Footer />
			</Router>
		</>
	);
}

export default App;
