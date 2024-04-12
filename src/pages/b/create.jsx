import React,{ useEffect, useState } from "react";
import http from '../../lib/http'
import * as apis from '../../lib/api'
import { Button, Form, Input,Modal, message, InputNumber  } from 'antd';
import { useLocation, useNavigate, useParams } from "react-router-dom";


const Index = () => {
    const [loading, setLoading] = useState(false)
    const [update, setUpdate] = useState(new Date().getTime())
    const [form] = Form.useForm()
    const urlParam = useParams()
    const l = useLocation()
    const n = useNavigate()

    useEffect(()=>{
        console.log(urlParam)
        let params = new URLSearchParams(l.search)
        if(params.get("name") && urlParam.id !== ":id"){
            let latitude = parseFloat(params.get("latng").split(",")[0]); //纬度
            let longitude = parseFloat(params.get("latng").split(",")[1]); //经度
            let address = params.get("addr") + params.get("name")
            let data = JSON.parse(sessionStorage.getItem(`/b/create/${urlParam.id}`))
            data.address = address
            data.latitude = latitude
            data.longitude = longitude
            form.setFieldsValue(data)
        }
        if(params.get("name") && urlParam.id === ":id"){
            let latitude = parseFloat(params.get("latng").split(",")[0]); //纬度
            let longitude = parseFloat(params.get("latng").split(",")[1]); //经度
            let address = params.get("addr") + params.get("name")
            form.setFieldValue("address",address)
            form.setFieldValue("latitude",latitude)
            form.setFieldValue("longitude",longitude)
        }
        if(!params.get("name") && urlParam.id !== ":id"){
            let data = JSON.parse(sessionStorage.getItem(`/b/create/${urlParam.id}`))
            form.setFieldsValue(data)
        }

        let onresize = () => {
            setUpdate(new Date().getTime())
        }

        window.addEventListener("resize",onresize)
        return () => {
            window.removeEventListener("resize",onresize)
        }

        // eslint-disable-next-line
    },[])

    const doCreate = async (values) => {
        setLoading(true)
        try {
            try {
                let password = await http.post(apis.B_CREATE,values)
                if(urlParam.id === ":id"){
                    Modal.confirm({
                        title: "成功",
                        content: <p>请牢记密码：{password}</p>,
                        onOk: () => {
                            n("/b/list")
                        }
                    })
                }else{
                    message.success("操作成功")
                    n("/b/list")
                }
            } catch (error) {
                
            }
            setLoading(false)
        } catch (error) {
            
        }
    }

    const openMap = () => {
        window.location.href = `https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=${window.location.href.split("?")[0]}&key=FMVBZ-L7H3Q-4RG5D-4GYOE-UTQ2O-ZDB75&referer=myapp`
    }

    return (
        <div>
            <span style={{display: "none"}}>{update}</span>
            <div style={{width: 400}}>
                <Form labelCol={{span:7}} onFinish={doCreate} form={form} autoComplete="off">
                    <Form.Item hidden name="id">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item hidden name="latitude">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item hidden name="longitude">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="地图">
                        <Button onClick={openMap}>打开地图</Button>
                    </Form.Item>
                    <Form.Item label="地址" name="address" rules={[{required: true,message: '请输入'}]}>
                        <Input.TextArea placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="店铺名称" name="store_name">
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="负责人" name="store_leader_name" rules={[{required: true,message: '请选择'}]}>
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="负责人手机号" name="store_leader_phone" rules={[{required: true,message: '请选择'}]}>
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="BD经理" name="bd_leader" rules={[{required: true,message: '请选择'}]}>
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="BD经理手机号" name="bd_phone" rules={[{required: true,message: '请选择'}]}>
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item>
                        <div style={{display: "flex",justifyContent: "center"}}>
                            <Button loading={loading} type="primary" htmlType="submit">提交</Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Index