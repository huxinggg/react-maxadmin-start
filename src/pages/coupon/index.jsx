import React,{ useEffect, useState } from "react";
import http from '../../lib/http'
import * as apis from '../../lib/api'
import { Table,Button, Form, Input,Modal, message, Space, InputNumber, Select, DatePicker  } from 'antd';
import { cloneDeep } from "lodash"
import moment from "moment";


const Index = () => {
    const [search, setSearch] = useState({page: 1, page_size: 20, name: ''})
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState({list: []})
    const [update, setUpdate] = useState(new Date().getTime())
    const [open, setOpen] = useState(false)
    const [sendOpen, setSendOpen] = useState(false)
    const [sendRecordOpen, setSendRecordOpen] = useState(false)
    const [sendRecord,setSendRecord] = useState([])
    const [form] = Form.useForm()
    const [form2] = Form.useForm()
    

    const loadData = async (s) => {
        try {
            let data = await http.post(apis.COUPON_LIST, s)
            setResponse(data)
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

    const doEdit = async (v) => {
        setOpen(true)
        form.setFieldsValue(v)
    }

    const del = async (v) => {
        setLoading(true)
        try {
            await http.post(`${apis.COUPON_DELETE}?id=${v.id}`)
            await loadData(search)
            message.success("操作成功")
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 100
        },
        {
            title: '名称',
            dataIndex: 'name',
            width: 120,
        },
        {
            title: '满多少',
            dataIndex: 'overflow_price',
            width: 120,
        },
        {
            title: '减多少',
            dataIndex: 'discount_price',
            width: 120,
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            width: 120,
            render: (v) => (
                <span>{moment(v).format("YYYY-MM-DD HH:mm:ss")}</span>
            )
        },
        {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            width: 310,
            render: (v,r) => (
                <Space>
                    <Button loading={loading} type="link" onClick={() => doEdit(r)}>编辑</Button>
                    <Button danger loading={loading} type="link" onClick={() => del(r)}>删除</Button>
                    <Button loading={loading} type="link" onClick={() => {
                        setSendOpen(true)
                        form2.resetFields()
                        form2.setFieldValue("coupon_id",r.id)
                    }}>发放</Button>
                    <Button loading={loading} type="link" onClick={async () => {
                        setLoading(true)
                        try {
                            let rs = await http.get(`${apis.COUPON_SEND_RECORD}?id=${r.id}`)
                            setSendRecord(rs || [])
                        } catch (error) {
                            
                        }
                        setLoading(false)
                        setSendRecordOpen(true)
                    }}>发放记录</Button>
                </Space>
            )
        }  
    ];

    const save = async () => {
        setLoading(true)
        try {
            const values = await form.validateFields()
            await http.post(apis.COUPON_CREATE,values)
            await loadData(search)
            message.success("成功")
            setOpen(false)
        } catch (error) {
            
        }
        setLoading(false)
    }

    const onSend  = async () => {
        setLoading(true)
        try {
            const values = await form2.validateFields()
            values.expired_at = values.expired_at.format("YYYY-MM-DD HH:mm:ss")
            values.merchant_id = parseInt(values.merchant_id)
            try {
                if(values.sku_ids.length !== 0){
                    values.sku_ids = values.sku_ids.join(",")+","
                }else{
                    values.sku_ids = ''
                }
            } catch (error) {
                values.sku_ids = ''
            }
            await http.post(apis.COUPON_SEND,values)
            message.success("成功")
            setSendOpen(false)
        } catch (error) {
            
        }
        setLoading(false)
    }

    const recordColumns = [
        {
            title: '优惠券',
            dataIndex: 'coupon_name'
        },
        {
            title: '手机号',
            dataIndex: 'user_phone'
        },
        {
            title: '过期时间',
            dataIndex: 'expired_at_str'
        },
        {
            title: '发送时间',
            dataIndex: 'created_at_str'
        }
    ]

    return (
        <div>
            <Modal onCancel={() => setOpen(false)} open={open} onOk={save} forceRender title="新增优惠券">
                <Form form={form} labelCol={{span:5}}>
                    <Form.Item label="id" name="id" hidden>
                        <InputNumber placeholder="请输入" />
                    </Form.Item>
                    <Form.Item rules={[{required: true,message: '请输入'}]} label="优惠券名称" name="name">
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item rules={[{required: true,message: '请输入'}]} label="满多少" name="overflow_price">
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item rules={[{required: true,message: '请输入'}]} label="减多少" name="discount_price">
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal onCancel={() => setSendOpen(false)} open={sendOpen} onOk={onSend} forceRender title="发放优惠券">
                <Form form={form2} labelCol={{span:4}}>
                    <Form.Item label="coupon_id" hidden name="coupon_id">
                        <InputNumber placeholder="请输入" />
                    </Form.Item>
                    <Form.Item rules={[{required: true,message: '请输入'}]} label="手机号" name="phone">
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="商家ID" name="merchant_id">
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="商品ID" name="sku_ids">
                        <Select mode="tags" placeholder="支持多个" />
                    </Form.Item>
                    <Form.Item rules={[{required: true,message: '请选择'}]} label="过期时间" name="expired_at">
                        <DatePicker showTime />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal cancelButtonProps={{hidden: true}} onOk={() => setSendRecordOpen(false)} onCancel={() => setSendRecordOpen(false)} width={650} open={sendRecordOpen} title="发放记录">
                <Table 
                    dataSource={sendRecord} 
                    columns={recordColumns}
                    scroll={{
                        x: 600,
                        y: 400
                    }}
                    pagination={false}
                />
            </Modal>
            <span style={{display: "none"}}>{update}</span>
            <Button type="primary" onClick={() => {
                setOpen(true)
                form.resetFields()
            }}>新增</Button>
            <div style={{height: 12}}></div>
            <Table 
                scroll={{
                    x: "100vw",
                    y: `calc(100vh - 340px - ${document.getElementsByClassName("ant-table-thead")[0]?.clientHeight}px)`
                }}
                rowKey={`id`} 
                columns={columns} 
                loading={loading} 
                dataSource={response.list || []} 
                pagination={{
                    total: response.total,
                    pageSize: response.page_size,
                    onChange: async (page) => {
                        let cpSearch = cloneDeep(search)
                        cpSearch.page = page
                        setSearch(cpSearch)
                        setLoading(true)
                        await loadData(cpSearch)
                        setLoading(false)
                    },
                    current: response?.page,
                }} />
        </div>
    )
}

export default Index