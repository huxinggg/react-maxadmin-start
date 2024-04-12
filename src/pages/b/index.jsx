import React,{ useEffect, useState } from "react";
import http from '../../lib/http'
import * as apis from '../../lib/api'
import { Table,Button, Form, Input,Modal, message, Space  } from 'antd';
import { cloneDeep } from "lodash"
import moment from "moment";
import { useNavigate } from "react-router-dom";


const Index = () => {
    const [search, setSearch] = useState({page: 1, page_size: 20, name: ''})
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState({list: []})
    const [update, setUpdate] = useState(new Date().getTime())
    const n = useNavigate()

    const loadData = async (s) => {
        try {
            let data = await http.post(apis.B_LIST, s)
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
        sessionStorage.setItem(`/b/create/${v.id}`,JSON.stringify(v))
        n(`/b/create/${v.id}`)
    }


    const resetPassword = async (v) => {
        setLoading(true)
        try {
            let password = await http.post(`${apis.B_RESETPASSWORD}?id=${v.id}`)
            Modal.confirm({
                title: "成功",
                content: <p>请牢记密码：{password}</p>
            })
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    const del = async (v) => {
        setLoading(true)
        try {
            await http.post(`${apis.B_DELETE}?id=${v.id}`)
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
            width: 100,
            fixed: 'left'
        },
        {
            title: '负责人',
            dataIndex: 'store_leader_name',
            width: 120,
        },
        {
            title: 'BD经理',
            dataIndex: 'bd_leader',
            width: 120,
        },
        {
            title: 'BD经理手机号',
            dataIndex: 'bd_phone',
            width: 120,
        },
        {
            title: '名称',
            dataIndex: 'store_name',
            width: 120,
        },
        {
            title: '详细地址',
            dataIndex: 'address',
            width: 320,
        },
        {
            title: '加入时间',
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
            width: 240,
            render: (v,r) => (
                <Space>
                    <Button loading={loading} type="link" onClick={() => doEdit(r)}>编辑</Button>
                    <Button danger loading={loading} type="link" onClick={() => del(r)}>删除</Button>
                    <Button loading={loading} type="link" onClick={() => resetPassword(r)}>重置密码</Button>
                </Space>
            )
        }  
    ];

    return (
        <div>
            <span style={{display: "none"}}>{update}</span>
            <div style={{display: "flex",justifyContent: "space-between"}}>
                <Form layout="inline" onFinish={async (v) => {
                    setLoading(true)
                    let cpSearch = cloneDeep(search)
                    cpSearch.page = 1
                    cpSearch.name = v.name
                    setSearch(cpSearch)
                    try {
                        await loadData(cpSearch)
                    } catch (error) {
                        
                    }
                    setLoading(false)
                }}>
                    <Form.Item name={"name"}>
                        <Input allowClear placeholder="输入店主名或手机号" />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" loading={loading}>搜索</Button>
                    </Form.Item>
                </Form>
            </div>
            
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