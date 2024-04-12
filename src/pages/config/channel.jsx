import React,{ useEffect, useRef, useState } from "react";
import http from '../../lib/http'
import * as apis from '../../lib/api'
import { Table,Input, message, Button, Modal, Form, InputNumber,Popconfirm } from 'antd';
import { cloneDeep } from "lodash"
import axios from 'axios'

const Index = () => {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState({total:0})
    const [update, setUpdate] = useState(new Date().getTime())
    const [search, setSearch] = useState({page:1, page_size: 5})
    const [open, setOpen] = useState(false)
    const [form] = Form.useForm()
    const uploadRef = useRef()
    const brainIdRef = useRef()

    const loadData = async (s) => {
        try {
            let data = await http.post(`${apis.CHANNEL_LIST}`,s)
            setResponse(data)
        } catch (error) {
            
        }
    }

    const updateContent = async (obj) => {
        try {
            await http.post(apis.CHANNEL_CREATE,obj)
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        setLoading(true)

        loadData(search).then(()=>{
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
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: '频道ID',
            dataIndex: 'channel_id'
        },
        {
            title: '链接',
            dataIndex: 'link'
        },
        {
            title: '备注',
            dataIndex: 'remark'
        },
        {
            title: '操作',
            dataIndex: 'action',
            width: 120,
            render: (v,r) => (
                <>
                    <Button type="link" onClick={() => {
                        setOpen(true)
                        console.log(r)
                        let cpR =cloneDeep(r)
                        if(cpR.role_avatar){
                            cpR.avatar = [{path: cpR.role_avatar,thumbUrl: process.env.REACT_APP_OSS_URL+"/"+cpR.role_avatar}]
                        }
                        form.resetFields()
                        form.setFieldsValue(cpR)
                    }}>编辑</Button>
                    <Popconfirm title="确认删除吗">
                        <Button danger type="link" onClick={async () => {
                            setLoading(true)
                            try {
                                await http.post(apis.CHANNEL_DELETE,{id: r.id})
                                await loadData(search)
                            } catch (error) {
                                
                            }
                            setLoading(false)
                            message.success("删除成功")
                        }}>删除</Button>
                    </Popconfirm>
                    
                </>
            )
        },
    ];

    const fileChange = async e => {
        if(e.target.files && e.target.files.length !== 0){
            let file = e.target.files[0]
            setLoading(true)
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_HOST}${apis.TRAIN}?brain_id=${brainIdRef.current}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': localStorage.getItem('token')
                    }
                });
                if(response.data.code !== 200){
                    message.error(response.data.msg)
                }else{
                    await loadData()
                    message.success("成功")
                }
                
            } catch (error) {
                message.error("失败")
            }

            setLoading(false)


            e.target.value = ''
        }
    }

    return (
        <div>
            <input type="file" style={{display: "none"}} ref={uploadRef} accept=".xls,.doc,.txt,.pdf,.csv" onChange={fileChange} />
            <span style={{display: "none"}}>{update}</span> 
            <Modal
                title="新建/更新"
                open={open}
                width={'60%'}
                forceRender
                onCancel={()=>{
                    setOpen(false)
                }}
                okButtonProps={{loading}}
                onOk={async () => {
                    setLoading(true)
                    try {
                        let data = await form.validateFields()
                        let cpData = cloneDeep(data)
                        await updateContent(cpData)
                        await loadData(search)
                        message.success("成功")
                    } catch (error) {
                        
                    }
                    setLoading(false)
                    setOpen(false)
                }}
            >
                <div style={{maxHeight: 500, overflow: "auto"}}>
                    <Form form={form} labelCol={{span: 4}}>
                        <Form.Item name="id" hidden>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="channel_id" rules={[{required: true}]} label="频道ID">
                            <Input placeholder="请输入" />
                        </Form.Item>
                        <Form.Item name="link" label="链接">
                            <Input placeholder="请输入" />
                        </Form.Item>
                        <Form.Item name="remark" label="备注">
                            <Input.TextArea placeholder="请输入" rows={3} />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
            <Button type="primary" onClick={() => {
                form.resetFields()
                setOpen(true)
            }}>新增</Button>
            <div style={{height: 12}}></div>           
            <Table 
                scroll={{
                    y: `calc(100vh - 340px - ${document.getElementsByClassName("ant-table-thead")[0]?.clientHeight}px)`
                }}
                rowKey={`id`} 
                columns={columns} 
                loading={loading} 
                dataSource={response.list || []} 
                pagination={{
                    pageSize: response.page_size,
                    page: response.page,
                    total: response.total,
                    onChange: async (p)=>{
                        setLoading(true)
                        const cpSearch = cloneDeep(search)
                        cpSearch.page = p
                        setSearch(cpSearch)
                        await loadData(cpSearch)
                        setLoading(false)
                    }
                }} />
        </div>
    )
}

export default Index