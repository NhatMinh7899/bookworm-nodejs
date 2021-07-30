/* eslint-disable no-unused-expressions */

import React, { Component } from "react";
import { Col, Container, Row, Table, Figure } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.min.css";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import {post} from '../httpHelper';
export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      items:
        JSON.parse(localStorage.getItem("cart")) != null
          ? JSON.parse(localStorage.getItem("cart"))
          : [],
      carts: [],
      amounts: [],
      total: 0.0,
      cartCount:
        localStorage.getItem("cart_count") != null
          ? parseInt(localStorage.getItem("cart_count"))
          : 0,
    };
  }
  componentDidMount() {
    let totalcost = 0.0;
    this.state.items.map((re, i) => {
      totalcost = totalcost + Number(re.amount) * Number(re.final_price);
    });
    this.setState({
      total: totalcost.toFixed(2),
    });
  }
  componentWillUnmount() {
    this._mounted = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  increaseValue(book_id, amount) {
    if (amount <= 7) {
      let updateAmount = this.state.items.map((item) =>
        item.bookId == book_id ? { ...item, amount: item.amount + 1 } : item
      );
      localStorage.removeItem("cart");
      localStorage.setItem("cart", JSON.stringify(updateAmount));

      let items =
        JSON.parse(localStorage.getItem("cart")) !== null
          ? JSON.parse(localStorage.getItem("cart"))
          : [];
      let totalcost = 0.0;
      items.map((re, i) => {
        totalcost = totalcost + Number(re.amount) * Number(re.final_price);
      });
      this.setState({
        items:
          JSON.parse(localStorage.getItem("cart")) !== null
            ? JSON.parse(localStorage.getItem("cart"))
            : [],
        total: totalcost.toFixed(2),
      });
    } else {
      console.log("false");
    }
  }
  deleteItem(book_id) {
    let updateAmount = this.state.items.filter(
      (item) => item.bookId != book_id
    );
    localStorage.setItem("cart", JSON.stringify(updateAmount));
    localStorage.setItem(
      "cart_count",
      localStorage.getItem("cart") !== null
        ? JSON.parse(localStorage.getItem("cart")).length
        : 0
    );
    this.props.handleUpdateCartCount();
  }
  updateAll() {
    let totalcost = 0.0;
    localStorage.setItem(
      "cart_count",
      localStorage.getItem("cart") !== null
        ? JSON.parse(localStorage.getItem("cart")).length
        : 0
    );
    let item =
      JSON.parse(localStorage.getItem("cart")) !== null
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
    item.map((re, i) => {
      totalcost = totalcost + Number(re.amount) * Number(re.final_price);
    });
    this.setState({});
    this.setState({
      total: totalcost.toFixed(2),
      items:
        JSON.parse(localStorage.getItem("cart")) !== null
          ? JSON.parse(localStorage.getItem("cart"))
          : [],
      cartCount:
        localStorage.getItem("cart_count") !== null
          ? parseInt(localStorage.getItem("cart_count"))
          : 0,
    });
    this.props.handleUpdateCartCount();
  }
  updateItemCount(book_id) {
    let updateAmount = this.state.items.map((item) =>
      item.bookId == book_id ? { ...item, amount: item.amount - 1 } : item
    );
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(updateAmount));
  }
  decreaseValue(book_id, amount) {
    if (amount - 1 > 0) {
      this.updateItemCount(book_id);
      this.updateAll();
    } else if (amount - 1 == 0) {
      this.deleteItem(book_id);
      this.updateAll();
      toast.success("This book has been remove!", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      console.log("false");
    }
  }
  inputChangedHandler(e) {
    e.defaultValue();
  }
  handlePlaceOrder() {
    let items =
      JSON.parse(localStorage.getItem("cart")) !== null
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
    let order_items = new Array();
    if (items.length == 0) {
      toast.error("Your cart is empty!", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      items.map((value) => {
        order_items.push({
          book_id: value.bookId,
          quantity: value.amount,
          price: value.final_price,
          book_title: value.book_title,
        });
      }),
        axios.post("http://localhost:8080/api/ordering", {
            items: order_items,
          })
          .then((response) => {
            // localStorage.removeItem("cart");
            // this.updateAll();
            // this.timer = setTimeout(function () {
            //   window.location = "/";
            // }, 10000);
            toast.success("Order successfull!", {
              position: "bottom-right",
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          })
          .catch((error) => {
            let unavailable_book = error.response.data.unavailable_book;
            let invalid_quantity = error.response.data.invalid_quantity;
            if (unavailable_book.length !== 0) {
              unavailable_book.map((book, index) => {
                this.deleteItem(book.book_id);
              });
              toast.error("Some books unavailable!", {
                position: "bottom-right",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              this.updateAll();
            }
            if (invalid_quantity.length !== 0) {
              invalid_quantity.map((book, index) => {
                this.deleteItem(book.book_id);
              });
              toast.error("Some books wrong amount!", {
                position: "bottom-right",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              this.updateAll();
            }
          });
    }
  }
  render() {
    return (
      <>
        <Container>
          <Row>
            <ToastContainer />
            <Col md={12}>
              <hr />
              <h5>Item totals: {this.state.cartCount}</h5>
              <hr />
            </Col>
            <Col md={9}>
              <Table>
                <thead>
                  <tr id="table-title" height="60px">
                    <th width="230">Product </th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.items.map((result, index) => {
                    return (
                      <tr key={result.book_title}>
                        <td>
                          <Row>
                            <Col md={6}>
                              <Figure>
                                <Figure.Image
                                  width={130}
                                  height={190}
                                  alt="171x180"
                                  src={
                                    result.book_cover_photo
                                      ? "./images/bookcover/" +
                                        result.book_cover_photo +
                                        ".jpg"
                                      : "./images/bookcover/default.jpg"
                                  }
                                />
                                <Figure.Caption>
                                  By (author) {result.author_name}
                                </Figure.Caption>
                              </Figure>
                            </Col>
                            <Col md={6}>
                              <Row>
                                <Col md={12}>
                                  <p
                                    data-tip=""
                                    data-for={result.book_title + "4"}
                                  >
                                    <Link to={"/book/" + result.bookId}>
                                      {result.book_title}
                                    </Link>
                                  </p>
                                  <ReactTooltip
                                    id={result.book_title + "4"}
                                    getContent={() => {
                                      return "View detail";
                                    }}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </td>
                        <td>
                          <div className="product-details">
                            <div className="price">
                              <h3 className="product-price">
                                ${result.final_price}
                                <br />
                                <del className="product-old-price">
                                  {result.delPrice ? "$" + result.delPrice : ""}
                                </del>
                              </h3>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="price">
                            <div className="product-details">
                              <div className="add-to-cart">
                                <div className="qty-label">
                                  <div className="input-number">
                                    <input
                                      type="number"
                                      value="1"
                                      value={result.amount}
                                      onChange={(event) =>
                                        this.inputChangedHandler(event)
                                      }
                                    />
                                    <span
                                      className="qty-up"
                                      onClick={() =>
                                        this.increaseValue(
                                          result.bookId,
                                          result.amount
                                        )
                                      }
                                    >
                                      +
                                    </span>
                                    <span
                                      className="qty-down"
                                      onClick={() =>
                                        this.decreaseValue(
                                          result.bookId,
                                          result.amount
                                        )
                                      }
                                    >
                                      -
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="product-details">
                            <div className="price">
                              <h3 className="product-price">
                                $
                                {Number(
                                  result.final_price * result.amount
                                ).toFixed(2)}
                              </h3>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
            <Col md={3}>
              <Table>
                <thead>
                  <tr height="60px">
                    <th colSpan="2">
                      <h4>Cart totals</h4>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="product-details">
                        <div className="price">
                          <h4>
                            <strong>Total</strong>
                          </h4>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="product-details">
                        <div className="price">
                          <h3 className="product-price">
                            <strong className="order-total">
                              ${this.state.total}
                            </strong>
                          </h3>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <button
                className="primary-btn"
                onClick={() => this.handlePlaceOrder()}
              >
                PLACE ORDER
              </button>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
