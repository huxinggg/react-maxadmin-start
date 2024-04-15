import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from '../../lib/http'
import * as apis from '../../lib/api'
import { Table, Input, message, Button, Form } from 'antd';
import { cloneDeep } from "lodash"
import { render } from "@testing-library/react";
import moment from "moment";


const Index = () => {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState({ total: 0, list: [] })
    const [update, setUpdate] = useState(new Date().getTime())
    const [tempTxt, setTempTxt] = useState('')
    const [open, setOpen] = useState(false)
    const n = useNavigate()
    const [search, setSearch] = useState({
        page: 1,
        page_size: 20
    })
    const curData = useRef()

    const loadData = async (s) => {
        try {
            let data = await http.post(`${apis.ARTICLE_LIST}`, s)
            setResponse(data)
        } catch (error) {

        }
    }

    const updateContent = async (obj) => {
        try {
            await http.post(apis.TEMPLATE_UPDATE, obj)
        } catch (error) {

        }
    }

    useEffect(() => {
        setLoading(true)

        loadData(search).then(() => {
            setLoading(false)
        })

        let onresize = () => {
            setUpdate(new Date().getTime())
        }

        window.addEventListener("resize", onresize)
        return () => {
            window.removeEventListener("resize", onresize)
        }

        // eslint-disable-next-line
    }, [])


    const columns = [
        {
            title: 'ID',
            dataIndex: 'hash_id',
            fixed: 'left',
            width: 110
        },
        {
            title: 'title',
            dataIndex: 'title',
            width: 120
        },
        {
            title: '类型',
            dataIndex: 'make_type',
            width: 80,
            render: (v) => {
                if (v === "WWW") {
                    return "AI 搜索模式"
                }
                if (v === "AI") {
                    return "AI TOPIC模式"
                }
                if (v === "QUIZ") {
                    return "RAZ"
                }
                return "后台生成"
            }
        },
        {
            title: '蓝思值',
            dataIndex: 'lexile',
            width: 80
        },
        {
            title: '学科',
            dataIndex: 'subject',
            width: 80
        },
        {
            title: '年级',
            dataIndex: 'grade',
            width: 80
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            width: 80,
            render: (v) => (
                <>
                    {moment(v).format("YYYY-MM-DD HH:mm:ss")}
                </>
            )
        },
        {
            title: '操作',
            dataIndex: 'ac',
            fixed: 'right',
            width: 50,
            render: (v, r) => (
                <div>
                    <Button type="link" onClick={() => {
                        n(`/article/create?hash_id=${r.hash_id}`)
                    }}>修改</Button>
                </div>
            )
        }
    ];

    return (
        <div>
            <span style={{ display: "none" }}>{update}</span>
            <Form autoComplete="off" layout="inline" onFinish={async (val) => {
                const cpSearch = cloneDeep(search)
                cpSearch.page = 1
                cpSearch.content = val.content
                setSearch(cpSearch)
                setLoading(true)
                await loadData(cpSearch)
                setLoading(false)
            }}>
                <Form.Item name="content">
                    <Input allowClear placeholder="标题/文章内容" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={() => {
                        n(`/article/create`)
                    }}>新增</Button>
                </Form.Item>
            </Form>
            <div style={{ height: 24 }}></div>
            <Table
                scroll={{
                    x: "100vw",
                    y: `calc(100vh - 350px - ${document.getElementsByClassName("ant-table-thead")[0]?.clientHeight}px)`
                }}
                rowKey={`id`}
                columns={columns}
                loading={loading}
                dataSource={response.list || []}

                pagination={{
                    pageSize: response.page_size,
                    total: response.total,
                    showSizeChanger: false,
                    onChange: async (page) => {
                        console.log(page)
                        const cpSearch = cloneDeep(search)
                        cpSearch.page = page
                        setSearch(cpSearch)
                        setLoading(true)
                        await loadData(cpSearch)
                        setLoading(false)
                    }
                }} />
        </div>
    )
}

export default Index