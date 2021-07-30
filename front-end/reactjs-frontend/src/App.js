import "./App.css";
import React, { Component } from 'react';
import Home from "../src/components/pages/Home";
import Shop from "../src/components/pages/Shop";
import NavigationBar from "../src/components/navbar/Navbar";
import Product from "../src/components/pages/Product";
import Footer from '../src/components/footer/Footer';
import About from '../src/components/pages/About';
import Cart from '../src/components/pages/Cart';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";


export default class App extends Component {
  state = {
    cart: JSON.parse(localStorage.getItem('cart'))!==null?JSON.parse(localStorage.getItem('cart')):[],
    cartCount: localStorage.getItem('cart_count')!==null?parseInt(localStorage.getItem('cart_count')):0,
  }
  componentDidMount(){
    console.log(this.state.navActive)
  }
  handleUpdateCartCount = ()=> {
    localStorage.setItem('cart_count',localStorage.getItem('cart')!==null?JSON.parse(localStorage.getItem('cart')).length:0);
    this.setState({cartCount: localStorage.getItem('cart_count')!==null?parseInt(localStorage.getItem('cart_count')):0})
  }

  render(){
    return (
      <Router>
          <NavigationBar  count_item={this.state.cartCount} />
          <Switch>
            <Route path="/book/:id">
                <Product handleUpdateCartCount={this.handleUpdateCartCount}/>
            </Route>
            <Route exact path="/about"><About /></Route>
            <Route exact path="/cart"><Cart handleUpdateCartCount={this.handleUpdateCartCount}/></Route>
            <Route exact path="/shop"><Shop /></Route>
            <Route exact path="/"><Home/></Route>
          </Switch>
          <Footer />
      </Router>
    )
  };
  
}