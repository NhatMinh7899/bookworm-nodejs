import React, { Component } from 'react'
import {Col,Container,Row} from 'react-bootstrap';
export class About extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <hr/>
                        <h4>About us</h4>
                        <hr/>
                    </Col>
                    <Col md={12}>
                        <h2 style={{textAlign:'center'}}>Welcom to Bookwwrom</h2>
                        <p>" Bookworm is an independent New York bookstore and language school with locations in Manhattan and Brooklyn . We specialize in travel books and language classes "</p>
                    </Col>
                    <Col md={12}>
                        <Row>
                            <Col md={6}>
                                <h2 style={{textAlign:'center'}}>Our Story</h2>
                                <p>The name Bookworm was taken from the original name for New York International Airport which was renamed JFK in December 1963 </p>
                                <p>Our Manhattan store has just moved to the West Village . Our new location is 170 7th Avenue South , at the corner of Perry Street . </p>
                                <p> From March 2008 through May 2016 , the store was located in the Flatiron District .</p>
                            </Col>
                            <Col md={6}>
                                <h2 style={{textAlign:'center'}}>Our Vision</h2>
                                <p>We believe that a novel or travelogue can be just as valuable a key to a place as any guidebook , and our well - read , well - traveled staff is happy to make reading recommendations for any traveler , book lover , or gift giver .</p>
                                <p>One of the last travel bookstores in the country , our Manhattan store carries a range of guidebooks ( all 10 % off ) to suit the needs and tastes of every traveler and budget </p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default About