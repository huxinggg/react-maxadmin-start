import React from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

const App = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    window.location.href = "/"
  };
  return (
    <>
        <div style={{
            backgroundColor: '#2d3a4b',
            height: '100vh'
        }}>
            <div style={{
                width: 400,
                height: 400,
                margin: 'auto',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
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