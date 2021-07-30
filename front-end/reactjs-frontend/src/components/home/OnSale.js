import React from 'react';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {Link} from "react-router-dom";
import {get} from "../httpHelper";
import ReactTooltip from 'react-tooltip';
import {Col,Container,Row,Button} from 'react-bootstrap';

 class Onsale extends React.Component {
  constructor() {
    super();
    this.state = {
       data: []
    }
 }
 componentDidMount() {
 get("/home/top8onsale").then(response => {
  this.setState({ data : response.data });
 
})
}
render() {
      var settings = {
        infinite: false,
        speed: 500,
        dots: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        centerPadding: 100,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };
    return (
      <>
      
    <Container>
        <Row>
            <Col md={11}>
            <div id="product-tab">
                <ul className="tab-nav">
                    <div className="section-title">
                        <h3 className="title">On sale</h3>
                    </div>
                </ul>
            </div>
            </Col>
            <Col>
                <Button
                style={{margin:"2px"}}
                variant="danger"
                href="/shop"
                >View all</Button>
            </Col>
        </Row>
        <Row>
            <Col>
                  <Slider {...settings}>
                        {this.state.data.map((result,index) => {
                          if(index < 10){
                          return (
                              <div key={result.id}>
                              <div className="product">
                                  <div className="product-img">
                                      <img 
                                      src={result.book_cover_photo? "./images/bookcover/"+result.book_cover_photo+".jpg":"./images/bookcover/default.jpg"} 
                                      height="300px" alt=""
                                      />
                                  </div>
                                  <div className="product-body" style={{height: "150px"}}>
                                      <p className="author-name">   {result.author.author_name}</p>
                                      <p data-tip='' data-for={result.book_title+'4'}><Link to={"/book/"+result.id}>{result.book_title}</Link></p>
                                      <ReactTooltip id={result.book_title+'4'} getContent={() => { return "View detail" }}/>
                                  </div>
                                  <div className="product-body">
                                       <h4 className="product-price"><del className="product-old-price">${result.book_price}</del>${result.final_price} </h4>
                                  </div>
                              </div>
                              </div>
                          )}})}
                  </Slider>
            </Col>
        </Row>
          </Container>
      </>
    );
  }
}
export default Onsale;