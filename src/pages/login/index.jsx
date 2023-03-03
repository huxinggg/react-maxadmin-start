import React from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import bg from '../../static/img/bg.png'
import shadow from '../../static/img/aiwrap.png'

const App = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    window.location.href = "/"
  };
  return (
    <>
        <div style={{
            backgroundColor: '#2d3a4b',
            backgroundImage: `url(${bg})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100vw 100vh',
            height: '100vh'
        }}>
            <div style={{
                width: 420,
                height: 420,
                margin: 'auto',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                borderRadius: 4,
                backgroundColor: '#FFFFFF'
            }}>
                <div style={{width: '80%', margin: '0 auto', position: 'relative'}}>
                    <img src={shadow} style={{
                        position: 'absolute',
                        top: 58,
                        zIndex: 1,
                        left: -60
                    }} alt="" />
                    <div style={{
                        margin: "55px 0 0 -58px",
                        padding: "18px 10px 18px 60px",
                        background: "#189F92",
                        position: "relative",
                        color: "#fff",
                        fontSize: 16
                    }}>系统登录</div>
                    <div style={{height: 55}}></div>
                    <Form
                        autoComplete="off"
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
        </div>
        
    </>
  );
};
export default App;