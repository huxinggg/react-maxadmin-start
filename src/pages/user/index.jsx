import React,{ useState } from "react";
import http from '../../lib/http'
import * as apis from '../../lib/api'
import { Table, Button, Select, Form, Input,Modal, message, Space, InputNumber } from 'antd';
import { cloneDeep } from "lodash"
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import moment from 'moment'


const Index = () => {
    const [search, setSearch] = useState({page: 1, page_size: 20, phone: ""})
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState({list: []})
    const [roleList, setRoleList] = useState([])
    const [update, setUpdate] = useState(new Date().getTime())
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form] = Form.useForm()
    const [form2] = Form.useForm()
    

    const loadData = async (s) => {
        try {
            let data = await http.post(apis.USER_LIST, s)
            setResponse(data)
        } catch (error) {
            
        }
    }

    const loadRoleList = async () => {
        try {
            const l = await http.get(apis.USER_ROLE_LIST) || []
            const arr = []
            for(let i=0;i<l.length;i++){
                let item = l[i]
                arr.push({
                    label: item.name,
                    value: item.id
                })
            }
            setRoleList(arr)
        } catch (error) {
            
        }
    }

    useState(()=>{
        setLoading(true)

        loadRoleList().then(async ()=>{
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

    const onSubmit = async (values) => {
        let cpSearch = cloneDeep(search)
        cpSearch.phone = values.phone
        cpSearch.page = 1
        setLoading(true)
        try {
            await loadData(cpSearch)
        } catch (error) {
            
        }
        setLoading(false)
        setSearch(cpSearch)
    }

    const doCreate = async () => {
        setLoading(true)
        try {
            let values = await form2.validateFields()
            let ret = await http.post(apis.USER_CREATE,values)
            message.success("操作成功")
            setIsModalOpen(false)
            await loadData(search)
            if(!values.id){
                Modal.confirm({
                    content: `请牢记密码：${ret}`
                })
            }
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    const doEdit = async (v) => {
        try {
            form2.resetFields()
            let cpVaules = cloneDeep(v)
            cpVaules.status = cpVaules.status === 1 ? false:true
            if(cpVaules.avatar){
                cpVaules.avatar = [{path: v.avatar,thumbUrl: process.env.REACT_APP_OSS_URL+"/"+v.avatar}]
            }else{
                cpVaules.avatar = []
            }
            form2.setFieldsValue(cpVaules)
            setIsModalOpen(true)
        } catch (error) {
            console.log(error)
        }
    }

    const doDelete = async (id) => {
        try {
            await http.post(`${apis.USER_DELETE}?id=${id}`)
        } catch (error) {
            
        }
    }

    const initPassword = async (id) => {
        setLoading(true)
        try {
            let data = await http.post(`${apis.USER_PASSWORD_RESET}?id=${id}`)
            Modal.confirm({
                content: `请牢记密码：${data}`
            })
        } catch (error) {
            
        }
        setLoading(false)
    }

    const columns = [
        {
            title: '用户名',
            dataIndex: 'name',
        },
        {
            title: '角色',
            dataIndex: 'role_info',
            render: (v) => (
                <span>{v?.name}</span>
            )
        },
        {
            title: '登录账号',
            dataIndex: 'phone'
        },
        // {
        //     title: '状态',
        //     dataIndex: 'status',
        //     render: (v,r) => (
        //         <Switch checked={v === 1} onChange={async i => {
        //             setLoading(true)
        //             let cpV = cloneDeep(v)
        //             cpV = i === true ? 1:2
        //             try {
        //                 // await http.post(`${apis.ADMIN_DISABLED}?id=${r.id}&status=${cpV}`)
        //                 // await loadData(search)
        //             } catch (error) {
                        
        //             }
        //             setLoading(false)
        //         }} />
        //     )
        // },
        {
            title: '创建时间',
            dataIndex: 'created_at',
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
                    <Button loading={loading} type="link" onClick={() => initPassword(r.id)}>重置密码</Button>
                    <Button loading={loading} danger type="link" onClick={async () => {
                        Modal.confirm({
                            content: "确定删除吗?",
                            onOk: async () => {
                                setLoading(true)
                                try {
                                    await doDelete(r.id)
                                    await loadData(search)
                                    message.success("操作成功")
                                } catch (error) {
                                    
                                }
                                setLoading(false)
                            }
                        })
                    }}>删除</Button>
                </Space>
            )
        }  
    ];

    return (
        <div>
            <span style={{display: "none"}}>{update}</span>
            <Modal title="添加用户" forceRender open={isModalOpen} onCancel={() => setIsModalOpen(false)} okButtonProps={{loading}} onOk={doCreate}>
                <div style={{padding: 12}}>
                    <Form labelCol={{span: 4}} form={form2} autoComplete="off">
                        <Form.Item hidden name="id">
                            <InputNumber />
                        </Form.Item>
                        <Form.Item label="登录账号" name="phone" rules={[{required: true,message: '请输入'}]}>
                            <Input placeholder="请填入登录账号" />
                        </Form.Item>
                        <Form.Item label="用户名" name="name" rules={[{required: true,message: '请输入'}]}>
                            <Input placeholder="请填入用户名" />
                        </Form.Item>
                        <Form.Item label="角色" name="role_id" rules={[{required: true,message: '请选择'}]}>
                            <Select options={roleList} allowClear placeholder="请选择角色" />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
            <Form layout="inline" onFinish={onSubmit} autoComplete="off" form={form}>
                <Form.Item label="登录账号" name="phone">
                    <Input allowClear placeholder="请输入内容" />
                </Form.Item>
                <Form.Item>
                    <Button icon={<SearchOutlined />} type="primary" loading={loading} htmlType="submit">搜索</Button>
                </Form.Item>
                <Form.Item>
                    <Button icon={<UserAddOutlined />} type="primary" onClick={() => {
                        setIsModalOpen(true)
                        form.resetFields()
                    }} loading={loading}>添加用户</Button>
                </Form.Item>
            </Form>
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