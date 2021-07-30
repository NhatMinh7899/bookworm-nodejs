import React, { Component } from 'react'
import {Container, Row, Col,Breadcrumb,Accordion,Card} from 'react-bootstrap';
import { Button, Card as Ca, CardBody, CardText, CardGroup, CardTitle } from 'reactstrap';
import {get} from "../httpHelper";
import Pagination from "react-js-pagination";
import {Link} from "react-router-dom";
import ReactTooltip from 'react-tooltip';
export class Shop extends Component {
    constructor() {
        super();
        this.state = {
        categories: [],
        authors: [],
        pageNo: 5,
        activePage: 0,
        items: [],
        itemsCountPerPage: 0,
        totalItemsCount: 0,
        sortPage: 'onsale',
        filerValue: "",
        Label: ""
        }
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    async componentDidMount() {
            await get("/authors").then(response => {
                this.setState({ authors : response.data });
            })

            await get("/categories").then(response => {
                this.setState({ categories : response.data });
            })
            await get("/shop/"+this.state.sortPage+"?page="+this.state.activePage+"&size="+this.state.pageNo).then(response => {
                console.log(response);
                this.setState({ 
                    items: response.data.dataItems,
                    activePage: response.data.currentPage,
                    itemsCountPerPage: Number(response.data.totalPages),
                    totalItemsCount: response.data.totalItems,
                });
                console.log(this.state.items);
            })

    }
    handlePageChange(pageNumber) {
        get("/shop/"+this.state.sortPage+"?page="+ pageNumber + "&size=" + this.state.pageNo)
            .then(response => {
                this.setState({
                    items: response.data.dataItems,
                    activePage: response.data.currentPage
                });
            })
    }
    async sortPage(panovalue,sortvalue){
        await this.setState({
            pageNo: panovalue,
            sortPage: sortvalue,
            activePage: 0
        });
        await get("/shop/"+this.state.sortPage+"?size="+this.state.pageNo + "&page=" + this.state.activePage).then(response => {
            this.setState({ 
                items: response.data.dataItems,
                    activePage: response.data.currentPage,
                    itemsCountPerPage: Number(response.data.totalPages),
                    totalItemsCount: response.data.totalItems,
            });
        })
    }
    async handelFilter(id,filterLable){
        await this.setState({
            filerValue: id,
            activePage: 0,
            Label: filterLable
        });
        get("/shop/"+this.state.sortPage+this.state.filerValue+"?page="+this.state.activePage).then(response => {
            this.setState({ 
                items: response.data.dataItems,
                    activePage: response.data.currentPage,
                    itemsCountPerPage: Number(response.data.totalPages),
                    totalItemsCount: response.data.totalItems,
            });
        })
    }
    async clearFilter(){
        await this.setState({
            filerValue: '',
            activePage: 0,
            Label: ''
        })
        get("/shop/"+this.state.sortPage+this.state.filerValue+"?page="+this.state.activePage).then(response => {
            this.setState({ 
                items: response.data.dataItems,
                    activePage: response.data.currentPage,
                    itemsCountPerPage: Number(response.data.totalPages),
                    totalItemsCount: response.data.totalItems,
            });
        })
    }
    render() {
        return (
            <>
            <Container>
                <Row>
                    <Col md={12} >
                        <hr/>
                        <Breadcrumb>
                        <Breadcrumb.Item active>Books  {this.state.Label}</Breadcrumb.Item>
                        </Breadcrumb>
                        <hr/>
                    </Col>
                    <Col md={3}>
                        <Row>
                            <Col md={12}>
                                <CardGroup>
                                <Ca>
                                    <CardBody data-tip='' data-for="close"
                                    onClick={()=>this.clearFilter()}
                                    >
                                    <CardText>Filter by</CardText>
                                    <ReactTooltip id="close" getContent={() => { return "Clear filter" }}/>
                                    </CardBody>
                                </Ca>
                                </CardGroup>
                            </Col>
                            <Col md={12}>
                                <Accordion>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                            Category
                                        </Accordion.Toggle>

                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                            {this.state.categories.map(cate=>{
                                            return(
                                            <div key={cate.category_name} 
                                            onClick={event => this.handelFilter("/category/"+cate.id,'filter by Category '+cate.category_name)}
                                            >
                                                Category {cate.category_name}
                                            <hr/>
                                            </div>
                                            )
                                        })}
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="1">
                                            Author
                                        </Accordion.Toggle>

                                        <Accordion.Collapse eventKey="1">
                                            <Card.Body>
                                            {this.state.authors.map(cate=>{
                                            return(
                                            <div key={cate.author_name}
                                            onClick={event => this.handelFilter("/author/"+cate.id,'filter by Author '+cate.author_name)}
                                            >
                                                {cate.author_name}
                                            <hr/>
                                            </div>
                                            )
                                        })}
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="3">
                                            Rating reviews
                                        </Accordion.Toggle>

                                        <Accordion.Collapse eventKey="3">
                                            <Card.Body>
                                            <div 
                                        onClick={event => this.handelFilter("/star/1",'filter by 1 Star')}>
                                            1 Star
                                        <hr/>
                                        </div>
                                        <div onClick={event => this.handelFilter("/star/2",'filter by 2 Star')}
                                        >
                                            2 Star
                                        <hr/>
                                        </div>
                                        <div
                                        onClick={event => this.handelFilter("/star/3",'filter by 3 Star')}>
                                            3 Star
                                        <hr/>
                                        </div>
                                        <div 
                                        onClick={event => this.handelFilter("/star/4",'filter by 4 Star')}>
                                            4 Star
                                        <hr/>
                                        </div>
                                        <div
                                        onClick={event => this.handelFilter("/star/5",'filter by 5 Star')}>
                                            5 Star
                                        <hr/>
                                        </div>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={9}>
                        <Row>
                            <Col md={12}>
                                <div className="store-filter clearfix">
                                    <span className="store-qty">Showing {this.state.pageNo*(this.state.activePage+1) - this.state.pageNo} - {this.state.pageNo*(this.state.activePage+1)} of {this.state.totalItemsCount} {this.state.demo}</span>
                                    <div className="store-sort">
                                        <select className="input-select"
                                             onChange={event => this.sortPage(this.state.pageNo,event.target.value)}
                                        >
                                            <option value="onsale">Sort by on sale</option>
                                            <option value="popular">Sort by popularity</option>
                                            <option value="all/asc">Sort by price low to high</option>
                                            <option value="all/desc">Sort by price high to low</option>
                                        </select>
                                        <select className="input-select"  
                                            onChange={event => this.sortPage(event.target.value,this.state.sortPage)}
                                        >   <option value="5">show 5</option>
                                            <option value="10">show 10</option>
                                            <option value="15">show 15</option>
                                            <option value="20">show 20</option>
                                            <option value="25">show 25</option>
                                        </select>
                                    </div>
                                </div>   
                            </Col>
                            <Col md={12}>
                                <Row>
                                    {this.state.items.map((result,index) =>{
                                        if(result.state == 1){
                                            return(
                                                <Col md={3} key={result.book_summary}>
                                                <div key={result.id}>
                                                <div className="product">
                                                    <div className="product-img">
                                                        <img src={result.book_cover_photo? "./images/bookcover/"+result.book_cover_photo+".jpg":"./images/bookcover/default.jpg"} height="200px" alt=""/>
                                                    </div>
                                                    <div className="product-body" style={{height: "150px"}}>
                                                        <p className="author-name">   {result['author.author_name']}</p>
                                                        <p data-tip='' data-for={result.book_title}><Link to={"/book/"+result.id}>{result.book_title}</Link></p>
                                                        <ReactTooltip id={result.book_title} getContent={() => { return "View detail" }}/>
                                                    </div>
                                                    <div className="product-body">
                                                         <h4 className="product-price"><del className="product-old-price">${result.book_price}</del>${result.final_price} </h4>
                                                    </div>
                                                </div>
                                                </div>
                                                </Col>
                                            )
                                        }else if(result.state == 0 || result.state == null){
                                            return(
                                                <Col md={3} key={result.book_title}>
                                                <div>
                                                <div className="product">
                                                    <div className="product-img">
                                                        <img src={result.book_cover_photo? "./images/bookcover/"+result.book_cover_photo+".jpg":"./images/bookcover/default.jpg"}  height="200px" alt=""/>
                                                    </div>
                                                    <div className="product-body" style={{height: "150px"}}>
                                                        <p className="author-name">{result['author.author_name']}</p>
                                                        <p data-tip='' data-for={result.book_title}><Link to={"/book/"+result.id}>{result.book_title}</Link></p>
                                                        <ReactTooltip id={result.book_title} getContent={() => { return "View detail" }}/>
                                                        
                                                    </div>
                                                    <div className="product-body">
                                                         <h4 className="product-price">${result.final_price}</h4>
                                                    </div>
                                                </div>
                                                </div>
                                                </Col>
                                            )
                                        }
                                        
                                    }
                                    )}
                                   
                                </Row>
                                <div id="react-paginate">
                                <Pagination
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={this.state.itemsCountPerPage}
                                        totalItemsCount={this.state.totalItemsCount}
                                        pageRangeDisplayed={5}
                                        onChange={this.handlePageChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                      
                    </Col>
                </Row>
            </Container>
            
            
            </>
        )
    }
}

export default Shop