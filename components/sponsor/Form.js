import React, { useState } from 'react';
import { Card, Form, Input, Button  } from 'antd';

const layout = {
  labelCol: {
    span: 8,
  },
  style: { maxWidth: "700px" }
};

const tailLayout = {
  wrapperCol: {
    offset: 16,
    span: 16,
  },
};

function MintNFT({ volunteerContract }) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState("");

  const onFinish = async (values) => {
    try{
      setLoading(true);
      console.log(values);

      setLoading(false);
    } catch(error) {
      console.error(error);
      setLoading(false);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Card style={{ margin: '1rem 0'}}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "0" }}>
          Be Reward Sponsor
        </h1>
      </Card>
      <Card>
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="sponsorName"
            label="Sponsor Name:"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="totalRewardAmount"
            label="Total Reward Amount:"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="rewardPerVolunteerToken"
            label="Reward per Volunteer Token:"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className="primary-bg-color" loading={loading}>
              Sponsor
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