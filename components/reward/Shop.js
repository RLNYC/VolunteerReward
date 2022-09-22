import React from 'react';
import { Card, Row, Col, Button } from 'antd';

function Shop() {
  return (
    <div>
      <Card style={{ margin: '1rem 0'}}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "0" }}>
          Company Sponsored Products
        </h1>
      </Card>
      <Card>
        <Card>
          <Row>
            <Col xs={{ span: 24}} lg={{ span: 10 }}>
              <img src="/sponser1.png" alt="Home" style={{ width: "100%", height: "100px", objectFit: "contain" }} />
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 12,  offset: 2 }}>
              <p style={{ fontSize: "1.2rem", marginBottom: 0 }}>1 Matic token</p>
              <p style={{ fontSize: "1.2rem", marginBottom: 0 }}>For</p>
              <p style={{ fontSize: "1.2rem", marginBottom: 0 }}>1 Volunteer token</p>
              <Button type="primary" disabled>
                Redeem
              </Button>
            </Col>
          </Row>
        </Card>
         <br />
      </Card>
    </div>
  )
}

export default Shop;