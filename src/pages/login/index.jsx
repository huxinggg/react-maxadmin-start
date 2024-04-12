import React,{ useEffect, useState , useContext} from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import styles from './index.module.css'
import http from '../../lib/http'
import * as apis from '../../lib/api'
import Bg from '../../static/img/2.png'
import { globalContext } from '../../components/context'
import { useNavigate } from "react-router-dom";

const App = () => {
  const c = useContext(globalContext)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const n = useNavigate()

  useEffect(()=>{
    let account = localStorage.getItem("account")
    if(account){
        form.setFieldsValue({phone: account, rem: true})
    }
    // eslint-disable-next-line
  },[])

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    setLoading(true)
    try {
        let ret = await http.post(apis.LOGIN, values)
        localStorage.setItem("token", ret.token)
        localStorage.setItem("name", ret.name)
        if(values.rem){
            localStorage.setItem("account", values.phone)
        }else{
            localStorage.removeItem("account")
        }
        let txt = await c.onLoad()
        if(txt){
            setLoading(false)
            message.error(txt)
            return
        }
        n("/")
    } catch (error) {
        
    }
    setLoading(false)
  };

  return (
    <>
        <div style={{
            backgroundRepeat: 'no-repeat',
            height: '100vh',
            position: "relative",
            background: `url(${Bg})`,
            backgroundSize: "cover"
        }}>
            <div className={styles.loginBox}>
                <div style={{height: 77}}></div>
                <div style={{fontSize: 24,fontWeight: 400,color: "#0256FF", textAlign: "center"}}>【{process.env.REACT_APP_NAME}】管理平台</div>
                <div style={{height: 44}}></div>
                <div style={{width: 382, margin: "0 auto"}}>
                    <Form
                        form={form}
                        autoComplete="off"
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        >
                        <Form.Item
                            name="phone"
                            rules={[
                            {
                                required: true,
                                message: '请输入',
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
                                message: '请输入',
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
                        <Form.Item
                            name="rem"
                            valuePropName="checked"
                        >
                            <Checkbox>记住账号</Checkbox>
                        </Form.Item>
                        <Form.Item>
                            <Button loading={loading} style={{
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