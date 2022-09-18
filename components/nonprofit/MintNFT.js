import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form, Select, Input, Button, Typography  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Web3Storage } from 'web3.storage';

const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_APIKEY });

const layout = {
  style: { maxWidth: "700px" }
};

const tailLayout = null;

function MintNFT({ volunteerContract }) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [hoursList, setHoursList] = useState([]);
  const [transaction, setTransaction] = useState("");

  const onFinish = async (values) => {
    try{
      setLoading(true);
      console.log(values);

      const volunteerData = JSON.stringify({ charities: values.charities, volunteerAddress:  addressList, volunteerHours:hoursList });
      const blob = new Blob([volunteerData], {type: "text/plain"});
      const fileToUpload = new File([ blob ], 'volunteerData.json');

      const cid = await client.put([fileToUpload], {
        onRootCidReady: localCid => {
          console.log(`> 🔑 locally calculated Content ID: ${localCid} `)
          console.log('> 📡 sending files to web3.storage ')
        },
        onStoredChunk: bytes => console.log(`> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`)
      })

      console.log(`https://dweb.link/ipfs/${cid}`);

      const transaction = await volunteerContract.batchMint(addressList, hoursList, values.charities, `https://dweb.link/ipfs/${cid}`);
      const tx = await transaction.wait();
      console.log(tx);

      setTransaction(tx.transactionHash);
      setLoading(false);
    } catch(error) {
      console.error(error);
      setLoading(false);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  const addToList = () => {
    setAddressList([...addressList, address]);
    setHoursList([...hoursList, hours]);
    setAddress("");
    setHours("");
  };

  return (
    <div>
      <Card style={{ margin: '1rem 0'}}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "0" }}>
          Mint Volunteer Hour NFT
        </h1>
      </Card>
      <Card>
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} layout= "vertical">
          <Form.Item
            name="charities"
            label="Charities"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Row gutter={[16, 16]} justify="space-around" align="bottom">
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="volunteerAddress"
                label="Volunteer Address"
              >
                {addressList.map((a, index) => <p key={index}>{a}</p>)}
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={11}> 
              <Form.Item
                name="volunteerHours"
                label="Volunteer Hours"
              >
                {hoursList.map((h, index) => <p key={index}>{h}</p>)}
                <Input value={hours} onChange={(e) => setHours(e.target.value)} />
              </Form.Item>
              
            </Col>
            <Col className="gutter-row" span={1}> 
              <Button className="primary-bg-color" type="primary" icon={<PlusOutlined />} onClick={addToList} style={{ marginBottom: "1.5rem" }}/>
            </Col>
          </Row>
          

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className="primary-bg-color" loading={loading}>
              Mint
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Form.Item>
        </Form>
        {transaction && <p>Success, {transaction}</p>}
      </Card>
    </div>
  )
}

export default MintNFT;