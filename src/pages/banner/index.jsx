import { Button, Table , Image, Modal, Form, message} from "antd";
import React, { useEffect, useState } from "react";
import http from '../../lib/http'
import * as apis from '../../lib/api'
import Upload from '../../components/upload';
import { cloneDeep } from 'lodash'

const Index = () => {
    const [resData, setResData] = useState({})
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [update, setUpdate] = useState(new Date().getTime())
    const [form] = Form.useForm()


    const loadData = async () => {
        try {
            let ret = await http.get(apis.BANNER_LIST)
            setResData(ret)
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        setLoading(true)
        loadData().then(r => {
            setLoading(false)
        })

        let onresize = () => {
            setUpdate(new Date().getTime())
        }

        window.addEventListener("resize",onresize)
        return () => {
            window.removeEventListener("resize",onresize)
        }
        // eslint-disable-next-line
    },[])

    const columns = [
        {
            title: '图片',
            dataIndex: 'img',
            width: 269,
            render: (v) => (
                <Image width={249} height={73} src={process.env.REACT_APP_OSS_URL+"/"+v} />
            )
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (v,r,dx) => (
                <Button onClick={() => {
                    let cpData = cloneDeep(resData)
                    cpData.list.splice(dx,1)
                    setResData(cpData)
                }} type="link" danger>删除</Button>
            )
        }
    ]
    const create = () => {
        form.resetFields()
        setOpen(true)
    }

    const onSubmit = async () => {
        setLoading(true)
        try {
            let values = await form.validateFields()
            let cpData = cloneDeep(resData)
                cpData.list.push({
                    img: values.img[0].path
                })
            setResData(cpData)
            setOpen(false)
            form.resetFields()
            // await http.post(apis.BANNER_UPDATE,values)
   
            // await loadData(search)
            // message.success("操作成功")
        } catch (error) {
            
        }
        setLoading(false)
    }

    const save = async () => {
        setLoading(true)
        try {
            await http.post(apis.BANNER_UPDATE,resData.list)
            await loadData()
            message.success("操作成功")
        } catch (error) {
            
        }
        setLoading(false)
    }

    return (
        <div>
            <span style={{display: "none"}}>{update}</span>
            <Modal onCancel={() => setOpen(false)} okButtonProps={{loading}} onOk={onSubmit} open={open}>
                <div style={{padding: 12}}>
                    <Form labelCol={{span:4}} form={form}>
                        <Form.Item name="img" rules={[{required: true,message: '请上传'}]}>
                            <Upload />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
            <Button type="primary" onClick={create} loading={loading}>新建</Button>
            <div style={{height: 12}}></div>
            <Table scroll={{
                y: `calc(100vh - 340px - ${document.getElementsByClassName("ant-table-thead")[0]?.clientHeight}px)`
            }} rowKey={`id`} columns={columns} dataSource={resData?.list} pagination={false} />
            <div style={{height: 12}}></div>
            <div style={{display: "flex",justifyContent: "center"}}>
                <Button type="primary" onClick={save} loading={loading}>保存</Button>
            </div>
        </div>
    )
}

export default Index