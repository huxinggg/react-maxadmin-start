import React,{ useContext, useState } from "react";
import http from '../../lib/http'
import * as apis from '../../lib/api'
import { Button, Select, Form, Input, message, Space, Modal  } from 'antd';
import { cloneDeep } from "lodash"
import Upload from '../../components/upload'
import { Context } from "../../components/layout";
import { RoleData } from '../../utils'

const Index = () => {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [form] = Form.useForm()
    const [form2] = Form.useForm()
    const lc = useContext(Context)


    useState(()=>{
        setLoading(true)
        http.get(apis.ADMIN_INFO).then(data => {
            setLoading(false)
            if(data.avatar){
                data.avatar = [{path: data.avatar,thumbUrl: process.env.REACT_APP_OSS_URL+"/"+data.avatar}]
            }else{
                data.avatar = []
            }
            form.setFieldsValue(data)
        })
        // eslint-disable-next-line
    },[])

    const doUpdate = async () => {
        try {
            let values = await form.validateFields()
            let cpV = cloneDeep(values)
            cpV.avatar = cpV.avatar[0].path
            setLoading(true)
            try {
                await http.post(apis.ADMIN_UPDATE,cpV)
                lc.reloadInfo()
                message.success("操作成功")
                window.history.back()
            } catch (error) {
                
            }
            setLoading(false)
        } catch (error) {
            
        }
    }

    const doChangePassword = async () => {
        setLoading(true)
        try {
            let values = await form2.validateFields()
            let cpV = cloneDeep(values)
            if(cpV.new_password !== cpV.new_password2){
                message.error("两次输入密码不一致")
                return
            }
            if(cpV.new_password.length < 6){
                message.error("秘钥要大于6位")
                return
            }
            await http.post(apis.ADMIN_SET_PASSWORD,cpV)
            message.success("修改成功")
            lc.reloadInfo()
        } catch (error) {
            
        }
        setLoading(false)
    }

    return (
        <>
            <Modal forceRender title="修改密码" okButtonProps={{loading}} open={open} onOk={doChangePassword} onCancel={() => setOpen(false)}>
                <Form autoComplete="off" form={form2} labelCol={{span:4}}>
                    <Form.Item label="旧密码" name="old_password" rules={[{required: true,message: '请输入'}]}>
                        <Input placeholder="请输入旧密码" type="password" />
                    </Form.Item>
                    <Form.Item label="新密码" name="new_password" rules={[{required: true,message: '请输入'}]}>
                        <Input placeholder="请输入新密码" type="password" />
                    </Form.Item>
                    <Form.Item label="确认密码" name="new_password2" rules={[{required: true,message: '请输入'}]}>
                        <Input placeholder="请输入新密码" type="password" />
                    </Form.Item>
                </Form>
            </Modal>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{width: 500}}>
                    <Form form={form} labelCol={{span:4}}>
                        <Form.Item name="avatar" label="用户头像" rules={[{required: true,message: '请上传'}]}>
                            <Upload />
                        </Form.Item>
                        <Form.Item name="name" label="用户名称" rules={[{required: true,message: '请输入'}]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="role_id" label="角色" rules={[{required: true,message: '请选择'}]}>
                            <Select disabled options={RoleData} />
                        </Form.Item>
                        <Form.Item name="phone" label="登录账号" rules={[{required: true,message: '请输入'}]}>
                            <Input maxLength={11} />
                        </Form.Item>
                        <Form.Item>
                            <div style={{textAlign: "center"}}>
                                <Space>
                                    <Button type="primary" loading={loading} onClick={doUpdate}>确定</Button>
                                    <Button loading={loading} onClick={() => window.history.back()}>取消</Button>
                                </Space>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
                <Button type="link" onClick={() => {
                    setOpen(true)
                    form2.resetFields()
                }}>修改密码</Button>
            </div>
        </>
    )
}

export default Index