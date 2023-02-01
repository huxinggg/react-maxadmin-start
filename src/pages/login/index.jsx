import React from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';

const App = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };
  return (
    <>
        <div style={{
            backgroundColor: '#2d3a4b',
            height: '100vh'
        }}>
            <div style={{
                width: 300,margin: '0 auto',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -100,
                marginLeft: -100,
            }}>
                <h3 style={{color: '#FFFFFF',textAlign: 'center',fontSize: 26}}>系统登录</h3>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    >
                    <Form.Item
                        name="username"
                        rules={[
                        {
                            required: true,
                            message: '请输入账号',
                        },
                        ]}
                    >
                        <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="账号" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                        {
                            required: true,
                            message: '请输入密码',
                        },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                            size="large"
                        />
                    </Form.Item>
                    {/* <Form.Item>
                        <a className="login-form-forgot" href="">
                        Forgot password
                        </a>
                    </Form.Item> */}
                    <Form.Item>
                        <Button style={{
                            width: '100%'
                        }} size="large" type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
        
    </>
  );
};
export default App;