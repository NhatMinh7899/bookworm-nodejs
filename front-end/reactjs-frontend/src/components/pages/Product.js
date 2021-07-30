import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import {Col,Container,Row,Breadcrumb,Figure} from 'react-bootstrap';
import {get} from '../httpHelper';
import Pagination from "react-js-pagination";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
export class Product extends Component {
    constructor() {
        super();
        this.state = {
            pageNo: 5,
            sortState: 'desc',
            activePage: 1,
            itemsCountPerPage: 1,
            totalItemsCount: 1,
            items: [],
            data: [],
            star: 'all',
            review_title: '',
            review_details: '',
            buyQuantity: 1,
            finalPrice: '',
            delPrice: '',
            id: 0,
            count_star:[],
            cart: JSON.parse(localStorage.getItem('cart'))!==null?JSON.parse(localStorage.getItem('cart')):[],
            cartCount: localStorage.getItem('cart_count')!==null?parseInt(localStorage.getItem('cart_count')):0
            
        }
        //this.handlePageChange = this.handlePageChange.bind(this);
    }
    async componentDidMount() {
        await this.setState({
            id: this.props.match.params.id
        })
        await get("/book/"+this.state.id).then(response => {
            this.setState({ data : response.data });
            console.log(response);
            console.log(response.data.category.category_name);
            this.setState({
                    finalPrice: response.data.final_price,
                    delPrice: response.data.book_price,
                })
            
        });
       console.log(this.state.data.category.category_name);
    
    }


    
    increaseBuyQuantity(){
        if(this.state.buyQuantity < 8){
            this.setState((pre,a)=>{
                return{
                buyQuantity: pre.buyQuantity + 1
                }
            })
        }
    }
    decreaseBuyQuantity(){
        if(this.state.buyQuantity > 1){
            this.setState((pre,a)=>{
                return{
                buyQuantity: pre.buyQuantity - 1
                }
            })
        }
    }
    convertDate(date2convert) {
        var datecovert = new Date(date2convert);
        datecovert = datecovert.getFullYear() + '-' + (datecovert.getMonth() + 1) + '-' + datecovert.getDate();
        datecovert = datecovert.split(/\D/);
        datecovert = new Date(datecovert[0], datecovert[1] - 1, datecovert[2]);
        return datecovert.toLocaleString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    isBookAdded(bookId){
        return this.state.cart.some(item => bookId === item.bookId);
      }
    handleAddToCart = (book_id, amount,book_title,author_name,final_price,book_cover_photo,delPrice) => {
        let carts = JSON.parse(localStorage.getItem('cart'))!==null?JSON.parse(localStorage.getItem('cart')):[];
        if (this.isBookAdded(book_id)) {
          let newCart = carts.map(book => (
                                    (book.bookId === book_id && book.amount+amount<=8)
                                    ?{ ...book, amount: book.amount+amount }
                                    :{ ...book, amount:8 }
                                  ))
          this.setState({cart: newCart },()=>{
                                localStorage.setItem('cart', JSON.stringify(this.state.cart))
                                localStorage.setItem('cart_count',this.state.cart.length)
                        });
        }
        else
        {
          this.setState({
                          cart: [...carts,{
                                'bookId': book_id,
                                'amount': amount,
                                'final_price':final_price,
                                'book_cover_photo':book_cover_photo,
                                'delPrice':delPrice,
                                'author_name':author_name,
                                'book_title':book_title

                                }],
                           cartCount: this.state.cartCount+1},
                          ()=> {
                                localStorage.setItem('cart', JSON.stringify(this.state.cart));
                                localStorage.setItem('cart_count',this.state.cart.length)
                        })
        }
      }
    async addProduct (bookId, amount,book_title,author_name,final_price,book_cover_photo,delPrice){
        await this.handleAddToCart(bookId, amount,book_title,author_name,final_price,book_cover_photo,delPrice);
        this.props.handleUpdateCartCount();
        toast.success('This book has been added to your cart!', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
    handleAmount(e){
        e.preventDefault();
    }   

    render() {
        if(this.state.data){
            console.log('aaaaaaaaaaaaaa')
            console.log(this.state.data.category);
            
            return (
                 <Container>
                    <>            
                    <ToastContainer />
                    <Row >
                        <Col md={12} >
                            <hr/>
                            <Breadcrumb>
                            
                            <Breadcrumb.Item active>Category {this.state.data.category ? this.state.data.category.category_name : 'acbbb'}</Breadcrumb.Item>
                            </Breadcrumb>
                            <hr/>
                         </Col>
                    <Col md={8}>
                        <Row>
                            <Col md={3}>
                            <Figure>
                                <Figure.Image
                                    width={130}
                                    height={190}
                                    alt="171x180"
                                    src={this.state.data.book_cover_photo? "./images/bookcover/"+this.state.data.book_cover_photo+".jpg":"./images/bookcover/default.jpg"} 
                                />
                                <Figure.Caption>
                                By (author)     {this.state.data.author_name}
                                </Figure.Caption>   
                            </Figure>
                            </Col>
                            <Col md={9}>
                                <Figure>
                                    <Figure.Caption>
                                    <h3>
                                    {this.state.data.book_title}
                                    </h3>
                                    </Figure.Caption>
                                    <Figure.Caption>
                                    {this.state.data.book_summary}
                                    </Figure.Caption>
                                    <Figure.Caption>
                                    <h4>Author biography</h4>
                                    {this.state.data.author_bio}
                                    </Figure.Caption>
                                </Figure>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4}>
                    <div>
                        <div className="product-details">
                                <div className="price">
                                    <h3 className="product-price"><del className="product-old-price">{this.state.delPrice ? "$"+this.state.delPrice: ""}</del>${this.state.finalPrice}
                                    </h3>
                                </div>
                                <div className="qty-label qty">
                                    Quantity
                                    <div className="input-number">
                                        <input type="number"
                                        onChange={(e)=>this.handleAmount(e)}
                                        value={this.state.buyQuantity}
                                        
                                        />
                                        <span className="qty-up"
                                        onClick={()=>this.increaseBuyQuantity()}
                                        >+</span>
                                        <span className="qty-down"
                                        onClick={()=>this.decreaseBuyQuantity()}
                                        >-</span>
                                    </div>
                                </div>
                                <br/>
                                    <button className="primary-btn" 
                                    onClick={()=>
                                        this.addProduct(this.state.id,
                                                        this.state.buyQuantity,
                                                        this.state.data.book_title,
                                                        this.state.data.author.author_name,
                                                        this.state.data.final_price,
                                                        this.state.data.book_cover_photo,
                                                        this.state.delPrice
                                                        )}
                                    >add to cart</button>
                                
                            </div>
                    </div>
                    </Col>
                        </Row>
                    </>
                </Container>
            );
                
        }else{
            return(
                <Container>
                    <Row>
                        <Col>
                            <h1>Page not found</h1>
                        </Col>
                    </Row>
                </Container>
            )
        }
        
    }
}

export default withRouter(Product); 
