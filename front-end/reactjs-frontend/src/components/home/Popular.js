import React from 'react';
import {Link} from "react-router-dom";
import {get} from "../httpHelper";
import { Col, Row, Button} from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
class Popular extends React.Component {
    constructor() {
        super();
        this.state = {
          data: []
        }
    }
    componentDidMount() {
        get("/home/top8popular").then(response => {
          this.setState({ data : response.data });
          console.log(response.data);
        })
    }
    
    render() {
        return (
          <Row>
              {this.state.data.map((result,index) => {
                   if(index < 8 && result['discount.discount_price'] == 0 || result['discount.discount_price'] == null){
                    return (
                      <Col md={3}  key={result.book_title}>
                          <div className="product">
                                  <div className="product-img">
                                      <img
                                      src={result.book_cover_photo? "./images/bookcover/"+result.book_cover_photo+".jpg":"./images/bookcover/default.jpg"} 
                                      height="300px" alt=""/>
                                  </div>
                                  <div className="product-body" style={{height: "150px"}}>
                                      <p className="author-name">   {result['author.author_name']}</p>
                                      <p data-tip='' data-for={result.book_title+'3'}><Link to={"/book/"+result.id}>{result.book_title}</Link></p>
                                      <ReactTooltip id={result.book_title+'3'} getContent={() => { return "View detail" }}/>
                                  </div>
                                  <div className="product-body">
                                       <h4 className="product-price">${result.final_price}</h4>
                                  </div>
                              </div>
                      </Col>
                      
                )}else {
                    return (
                            <Col md={3} key={result.book_summary}>
                              <div className="product">
                                  <div className="product-img">
                                      <img
                                      src={result.book_cover_photo? "./images/bookcover/"+result.book_cover_photo+".jpg":"./images/bookcover/default.jpg"} 
                                      height="300px" alt=""/>
                                  </div>
                                  <div className="product-body" style={{height: "150px"}}>
                                      <p className="author-name">   {result['author.author_name']}</p>
                                      <p data-tip='' data-for={result.book_title+'3'}><Link to={"/book/"+result.id}>{result.book_title}</Link></p>
                                      <ReactTooltip id={result.book_title+'3'} getContent={() => { return "View detail" }}/>
                                  </div>
                                  <div className="product-body">
                                       <h4 className="product-price"><del className="product-old-price">${result.book_price}</del>${result.final_price} </h4>
                                  </div>
                              </div>
                            </Col>
                             )
                }
                })}
          </Row>
        );
      }
}
export default Popular;