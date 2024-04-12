import React,{ useEffect, useState } from "react";
import http from '../../lib/http'
import * as apis from '../../lib/api'
import { Table,Button, Form, Input, message, Space,Image, Select, DatePicker,Row, Col, InputNumber  } from 'antd';
import { cloneDeep } from "lodash"
import moment from "moment";
import axios from 'axios'

const { RangePicker } = DatePicker

const Index = () => {
    const [search, setSearch] = useState({page: 1, page_size: 20, name: ''})
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState({list: []})
    const [update, setUpdate] = useState(new Date().getTime())
    const [orderStatus, setOrderStatus] = useState([])
    const [form] = Form.useForm()

    const downLoadData = async (s) => {
        console.log(s)
        let response = await axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_HOST}${apis.ORDER_LIST}`, // 后端提供下载文件的URL
            responseType: 'blob', // 设置响应类型为二进制数据
            data: s,
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        // 创建一个 Blob 对象
        const blob = new Blob([response.data]);

        // 创建一个下载链接
        const downloadLink = window.URL.createObjectURL(blob);

        // 创建一个隐藏的 <a> 标签，模拟点击以下载文件
        const link = document.createElement('a');
        link.href = downloadLink;
        link.setAttribute('download', '订单数据.csv'); // 设置文件名和扩展名
        document.body.appendChild(link);
        link.click();
        // 清理创建的链接
        window.URL.revokeObjectURL(downloadLink);
           
    }

    const loadData = async (s) => {
        try {
            let data = await http.post(apis.ORDER_LIST, s)
            for (let i = 0; i < data?.list?.length; i++) {
                if (data.list[i].b_remark_info) {
                  data.list[i].b_remark_info = JSON.parse(data.list[i].b_remark_info)
                }else{
                  data.list[i].b_remark_info = {}
                }
                if(data.list[i].coupon_info) {
                  data.list[i].coupon_info = JSON.parse(data.list[i].coupon_info)
                }else{
                  data.list[i].coupon_info = {}
                }
                // 接单商家信息
                if(data.list[i].merchant_info) {
                  data.list[i].merchant_info = JSON.parse(data.list[i].merchant_info)
                }
                // 取货商家信息
                if(data.list[i].get_merchant_info) {
                  data.list[i].get_merchant_info = JSON.parse(data.list[i].get_merchant_info)
                }
                if(data.list[i].pickup_info) {
                  data.list[i].pickup_info = JSON.parse(data.list[i].pickup_info)
                }
                if(data.list[i].remark_info) {
                  data.list[i].remark_info = JSON.parse(data.list[i].remark_info)
                }
                if(data.list[i].sku_info) {
                  data.list[i].sku_info = JSON.parse(data.list[i].sku_info)
                }
            }
            setResponse(data)
        } catch (error) {
            
        }
    }

    const loadOrderStatus = async () => {
        let status = await http.get(apis.ORDER_STATUS)
        setOrderStatus(status)
    }

    useEffect(()=>{
        setLoading(true)
        loadOrderStatus().then(async() => {
            await loadData(search)
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

    const btnHandler = async ({ order_no }) => {
        setLoading(true)
        try {
            await http.post(`${apis.ORDER_TURNOVER}?order_no=${order_no}`)
            await loadData(search)
            message.success("成功")
        } catch (error) {
            
        }
        setLoading(false)
    }

    const cancelOrder = async ({ order_no }) => {
        setLoading(true)
        try {
            await http.post(`${apis.ORDER_CANCEL}?order_no=${order_no}`)
            await loadData(search)
            message.success("成功")
        } catch (error) {
            
        }
        setLoading(false)
    }

    const rechoice = async ({ order_no }) => {
        setLoading(true)
        try {
            await http.post(`${apis.ORDER_RECHOICE}?order_no=${order_no}`)
            await loadData(search)
            message.success("成功")
        } catch (error) {
            
        }
        setLoading(false)        
    }

    const reSend = async ({ order_no }) => {
        setLoading(true)
        try {
            await http.post(`${apis.ORDER_RESEND}?order_no=${order_no}`)
            await loadData(search)
            message.success("成功")
        } catch (error) {
            
        }
        setLoading(false)         
    }

    

    const columns = [
        {
            title: '订单号',
            dataIndex: 'order_no',
            width: 190,
            fixed: 'left'
        },
        {
            title: '三方订单号',
            dataIndex: 'third_order_no',
            width: 270,
        },
        {
            title: '名字',
            dataIndex: 'name',
            width: 120,
        },
        {
            title: '购买者手机号',
            dataIndex: 'user_info',
            width: 130,
            render: (v) => {
                try {
                    return <span>{v.phone}</span>
                } catch (error) {
                    
                }
                return <></>
            }
        },
        {
            title: '配送方式',
            dataIndex: 'send_type',
            width: 120,
            render: (v) => (
                <span>{v === 1 ? '上门取件' : '送货到店'}</span>
            )
        },
        {
            title: '取货商家信息',
            dataIndex: 'get_merchant_info',
            width: 320,
            render: (v) => {
                try {
                    return <div>
                        <div>
                            商家店名： { v.store_name }
                        </div>
                        <div>商家手机号：  { v.store_leader_phone }</div>
                        <div>商家地址：  { v.address }</div>
                    </div>
                } catch (error) {
                    
                }
                return <></>
            }
        },
        {
            title: '接单商家信息',
            dataIndex: 'merchant_info',
            width: 320,
            render: (v) => {
                try {
                    return <div>
                        <div>
                            商家ID: { v.id }
                        </div>
                        <div>
                            商家店名: {v.store_name }
                        </div>
                        <div>
                            商家地址: {v.address }
                        </div>
                        <div>
                            商家手机号: {v.store_leader_phone }
                        </div>
                        <div>
                            BD经理: {v.bd_leader }
                        </div>
                        <div>
                            BD经理手机号: {v.bd_phone }
                        </div>
                    </div>
                } catch (error) {
                    
                }
                return <></>
            }
        },
        {
            title: '优惠券',
            dataIndex: 'coupon_info',
            width: 120,
            render: (v) => (
                <span>{v?.name}</span>
            )
        },
        {
            title: '实际付款',
            dataIndex: 'real_price_yuan',
            width: 120
        },
        {
            title: '状态',
            dataIndex: 'status_txt',
            width: 120
        },
        {
            title: '用户备注',
            dataIndex: 'remark_info',
            width: 200,
            render: (v) => {
                try {
                    return <div>
                        <div>{ v.txt }</div>
                        <div style={{height: 12}}></div>
                        <div style={{display: "flex",flexWrap: "wrap"}}>
                            {
                                v?.images?.map(v2 => (
                                    v2 && <Image style={{flexShrink: 0}} key={v2} src={process.env.REACT_APP_OSS_URL + "/" + v2} width={50} height={50} />
                                ))
                            }
                        </div>
                    </div>
                } catch (error) {
                    
                }
                return <></>
            }
        },
        {
            title: '商户备注',
            dataIndex: 'b_remark_info',
            width:200,
            render: (v) => {
                try {
                    return <div>
                        <div>{ v.txt }</div>
                        <div style={{height: 12}}></div>
                        <div style={{display: "flex",flexWrap: "wrap"}}>
                            {
                                v?.images?.map(v2 => (
                                    v2 && <Image style={{flexShrink: 0}} key={v2} src={process.env.REACT_APP_OSS_URL + "/" + v2} width={50} height={50} />
                                ))
                            }
                        </div>
                    </div>
                } catch (error) {
                    
                }
                return <></>
            }
        },
        {
            title: '商品信息',
            dataIndex: 'sku_info',
            width: 300,
            render: (v) => {
                try {
                    return <div>
                        {
                            v?.map(v2 => (
                                <div key={v2} style={{display: "flex",alignItems: "center"}}>
                                    <div style={{marginRight: 12}}>{v2.name}×{v2.num}</div>
                                    <Image key={v2} src={process.env.REACT_APP_OSS_URL + "/" + v2.cover} width={50} height={50} />
                                </div>
                            ))
                        }
                    </div>
                } catch (error) {
                    
                }
                return <></>
            }
        },
        {
            title: '付款时间',
            dataIndex: 'created_at',
            width: 120,
            render: (v) => (
                <span>{moment(v).format("YYYY-MM-DD HH:mm:ss")}</span>
            )
        },
        {
            title: '洗护类型',
            dataIndex: 'xihu_type',
            width: 120,
            render: (v) => {
                if(v === 1){
                    return '干洗'
                }
                if(v === 2){
                    return '水洗'
                }
                return <></>
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            width: 370,
            render: (v,r) => (
                <Space>
                    {
                        r.status === 1 
                        &&
                        <Button type="link" onClick={() => cancelOrder(r)}>退款</Button>
                    }
                    {
                        r.status === 2 
                        &&
                        <Button type="link" onClick={() => btnHandler(r)}>已从门店取件</Button>
                    }
                    {
                        r.status === 3 
                        &&
                        <Button type="link" onClick={() => btnHandler(r)}>清洗完成</Button>
                    }
                    {
                        r.status === 8
                        &&
                        <Button type="link" onClick={() => btnHandler(r)}>清洗</Button>
                    }
                    {
                        r.status === 9
                        &&
                        <Button type="link" onClick={() => btnHandler(r)}>通知客户确认地址</Button>
                    }
                    {
                        r.status === 10
                        &&
                        <Button type="link" onClick={() => btnHandler(r)}>已送达指定门店</Button>
                    }
                    {
                        (r.status === 10 || r.status === 11) 
                        &&
                        <Button type="link" onClick={() => rechoice(r)}>用户重新选择取货地址</Button>
                    }
                    {
                        (r.status === 12 || r.status === 13) 
                        &&
                        <Button type="link" onClick={() => reSend(r)}>退回到待送货</Button>
                    }
                    {
                        (r.status === 12) 
                        &&
                        <Button type="link" onClick={() => btnHandler(r)}>已取回工厂</Button>
                    }
                    {
                        (r.status === 11 || r.status === 12 || r.status === 13) 
                        &&
                        <Button type="link" onClick={() => btnHandler(r)}>通知客户取货</Button>
                    }
                </Space>
            )
        }  
    ];

    return (
        <div>
            <span style={{display: "none"}}>{update}</span>
            <div style={{display: "flex",justifyContent: "space-between"}}>
                <Form form={form} labelCol={{span:9}} onFinish={async (values) => {
                    setLoading(true)
                    if(values.times && values.times.length === 2){
                        values.start_at = values.times[0].format("YYYY-MM-DD")
                        values.end_at = values.times[1].format("YYYY-MM-DD")
                    }else{
                        values.start_at = ''
                        values.end_at = ''
                    }
                    let cpSearch = cloneDeep({...search,...values})
                    cpSearch.page = 1
                    setSearch(cpSearch)
                    try {
                        await loadData(cpSearch)
                    } catch (error) {
                        
                    }
                    setLoading(false)
                }}>
                    <Row gutter={12}>
                        <Col span={8}>
                            <Form.Item label="订单状态" name={"status"}>
                                <Select options={orderStatus} allowClear placeholder="请选择"></Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="订单号" name={"order_no"}>
                                <Input allowClear placeholder="请输入"  />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="bd经理/手机号" name={"bd_name"}>
                                <Input allowClear placeholder="请输入" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={8}>
                            <Form.Item label="购买者手机号" name={"phone"}>
                                <Input allowClear placeholder="请输入" />
                            </Form.Item>
                        </Col> 
                        <Col span={8}>
                            <Form.Item label="商家ID" name={"merchant_id"}>
                                <InputNumber  placeholder="请输入" />
                            </Form.Item>
                        </Col> 
                        <Col span={8}>
                            <Form.Item label="下单时间" name={"times"}>
                                <RangePicker style={{width: 330}} showTime />
                            </Form.Item>
                        </Col> 
                    </Row>
                    <Row gutter={12}>
                        <Col span={24}>
                            <div style={{display: "flex"}}>
                                <Form.Item style={{marginLeft: 20}}>
                                    <Button type="primary" htmlType="submit" loading={loading}>搜索</Button>
                                </Form.Item>
                                <Form.Item style={{marginLeft: 20}}>
                                    <Button type="primary" htmlType="submit" loading={loading} onClick={async () => {
                                        setLoading(true)
                                        let values = await form.validateFields()
                                        if(values.times && values.times.length === 2){
                                            values.start_at = values.times[0].format("YYYY-MM-DD")
                                            values.end_at = values.times[1].format("YYYY-MM-DD")
                                        }else{
                                            values.start_at = ''
                                            values.end_at = ''
                                        }
                                        let cpSearch = cloneDeep({...search,...values})
                                        setSearch(cpSearch)
                                        try {
                                            await downLoadData({...cpSearch, is_export: true})
                                        } catch (error) {
                                            
                                        }
                                        setLoading(false)
                                    }}>导出表格</Button>
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
            
            <div style={{height: 12}}></div>
            <Table 
                scroll={{
                    x: "100vw",
                    y: `calc(100vh - 480px - ${document.getElementsByClassName("ant-table-thead")[0]?.clientHeight}px)`
                }}
                rowKey={`id`} 
                columns={columns} 
                loading={loading} 
                dataSource={response.list || []} 
                pagination={{
                    showSizeChanger: false,
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