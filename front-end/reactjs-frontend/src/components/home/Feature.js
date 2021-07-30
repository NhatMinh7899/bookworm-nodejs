import Popular from './Popular';
import Recommended from './Recommend';
import React, { Component } from 'react'
import {Col,Container,Row,Tabs,Tab} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
export class Feature extends Component {
  render() {
    return (
            <Container>
                  <Row>
                      <Col md={12}>
                          <div id="product-tab">
                              <ul className="tab-nav">
                                  <div className="section-title">
                                      <h3 className="title">Featured books</h3>
                                  </div>
                              </ul>
                          </div>
                      </Col>
                        <Col>
                            <Tabs>
                                <Tab eventKey="home" title="Popular">
                                  <Popular />
                                </Tab>
                                <Tab eventKey="profile" title="Recommended">
                                  <Recommended />
                                </Tab>
                              </Tabs>
                        </Col>
                  </Row>

            </Container>
                


    )
  }
}

export default Feature