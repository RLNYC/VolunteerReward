import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Card, Typography, Button } from 'antd';
import { SmileOutlined, GiftOutlined, DollarCircleOutlined } from '@ant-design/icons';

const styles = {
  Landing: {
    WebkitBoxPack: "start",
    margin: "10px auto",
    maxWidth: "1000px",
  },
  SubHeader: {
    color: '#3AA628',
    fontSize: '26px',
    marginBottom: '-10px'
  },
  SubHeader2: {
    color: '#3AA628',
    fontSize: '22px',
  },
  TableP: {
    color: '#3AA628',
  },
};

function App({ volunteerContract }) {
  const router = useRouter();

  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(volunteerContract) getVolunteerLeaderBoard();
  }, [volunteerContract])

  const getVolunteerLeaderBoard = async () => {
    try{
      setLoading(true);
      const leaderAmount = await volunteerContract.leaderboardTotal();
      console.log(leaderAmount.toString());

      let temp = [];
      for (let i = 1; i < +leaderAmount.toString(); i++) {
        const address = await volunteerContract.idToAddress(i);
        console.log(address);

        const hours = await volunteerContract.leaderboardHours(address);
        console.log(hours.toString());

        temp.push({ address: address, hours: hours.toString()});
      }

      setLeaders(temp);
      setLoading(false);
    } catch(error) {
      console.error(error);
      setLoading(false);
    }
  };
  
  return <div style={styles.Landing}>
    <br />
    <br />
    <Row gutter={16}>
      <Col className="gutter-row" xs={{ span: 32 }} md={{ span: 12 }}>
        <Typography.Title style={{ marginTop: '3rem', marginBottom: 0}}>
          Volunteer to Earn
        </Typography.Title>
        <p style={styles.SubHeader}>Volunteer</p>
        <p style={styles.SubHeader}>Earn DoGood tokens</p>
        <br />
        <Button className="primary-bg-color" type="primary" size="large" onClick={() => router.push(`/nonprofit`)}>
          Get STARTED
        </Button>
      </Col>
      <Col className="gutter-row" xs={{ span: 32 }} md={{ span: 12 }}>
        <center>
          <img src="/home-img.png" alt="Home" width={300} height={300} />
        </center>
      </Col>
    </Row>
    <br />
    <br />
    <br />
    <Row gutter={16}>
      <Col className="gutter-row" xs={{ span: 32 }} md={{ span: 12 }} lg={{ span: 8}}>
        <Card>
          <center>
            <SmileOutlined style={{ fontSize: '3rem'}} />
            <h2>
              Volunteer
            </h2>
            <p>Volunteer with your favorite non-profit organization</p>
          </center>
        </Card>
      </Col>
      <Col className="gutter-row" xs={{ span: 32 }} md={{ span: 12 }} lg={{ span: 8}}>
        <Card>
          <center>
            <GiftOutlined style={{ fontSize: '3rem'}} />
            <h2>Earn</h2>
            <p>Receive NFT tracking your volunteering hours and redeem it for DoGood tokens </p>
          </center>
        </Card>
      </Col>
      <Col className="gutter-row" xs={{ span: 32 }} md={{ span: 12 }} lg={{ span: 8}}>
        <Card>
          <center>
            <DollarCircleOutlined style={{ fontSize: '3rem'}} />
            <h2>Reward</h2>
            <p>Buy company sponsored items with your DoGood tokens</p>
          </center>
        </Card>
      </Col>
    </Row>

    <br />
    <br />
    <br />
    <br />
    <Typography.Title level={2} >
      Volunteer Leadership Board
    </Typography.Title>

    <Row gutter={16}>
      <Col className="gutter-row" xs={{ span: 32 }} md={{ span: 12 }}>
        <Card>
          <h2 style={styles.TableP}>Top 5 For The Week</h2>
          <Row gutter={16}>
            <Col className="gutter-row" xs={{ span: 12 }}>
              <h3>Volunteer</h3>
              {leaders.map((l, i) => (
                <p key={i}>{l.address.substring(0, 5) + '...' + l.address.substring(37, 42)}</p>
              ))}
            </Col>
            <Col className="gutter-row" xs={{ span: 12 }}>
              <h3>Hours</h3>
              {leaders.map((l, i) => (
                <p key={i}>{l.hours}</p>
              ))}
            </Col>
          </Row>
        </Card>
      </Col>
      <Col className="gutter-row" xs={{ span: 32 }} md={{ span: 12 }}>
        <Card>
          <h2 style={styles.TableP}>Top 5</h2>
          <Row gutter={16}>
            <Col className="gutter-row" xs={{ span: 12 }}>
              <h3>Volunteer</h3>
              {leaders.map((l, i) => (
                <p key={i}>{l.address.substring(0, 5) + '...' + l.address.substring(37, 42)}</p>
              ))}
            </Col>
            <Col className="gutter-row" xs={{ span: 12 }}>
              <h3>Hours</h3>
              {leaders.map((l, i) => (
                <p key={i}>{l.hours}</p>
              ))}
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>

    <br />
    <br />

    <center>
      <Typography.Title level={2} >
        Join DoGood
      </Typography.Title>

      <Button className="primary-bg-color" type="primary" size="large" onClick={() => router.push(`/nonprofit`)}>
        Get STARTED
      </Button>
    </center>

   
  </div>;
}

export default App;