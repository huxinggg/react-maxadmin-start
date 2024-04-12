import React,{ useEffect, useRef, useState } from "react";
import http from '../../lib/http'
import * as apis from '../../lib/api'
import { Table,Input, message, Button, Modal,Image, Form, Select, InputNumber, Tooltip,Popconfirm } from 'antd';
import { cloneDeep } from "lodash"
import Upload from '../../components/upload'
import axios from 'axios'
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons'

const Index = () => {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [update, setUpdate] = useState(new Date().getTime())
    const [open, setOpen] = useState(false)
    const [form] = Form.useForm()
    const uploadRef = useRef()
    const brainIdRef = useRef()
    const ttsRoles = useRef([
        {
            value: "onyx",
            label: "onyx"
        },
        {
            value: "alloy",
            label: "alloy"
        },
        {
            value: "echo",
            label: "echo"
        },
        {
            value: "fable",
            label: "fable"
        },{
            value: "nova",
            label: "nova"
        },
        {
            value: "shimmer",
            label: "shimmer"
        },
        {
            value: "SSML_VOICE_GENDER_UNSPECIFIED",
            label: "谷歌-SSML_VOICE_GENDER_UNSPECIFIED"
        },
        {
            value: "MALE",
            label: "谷歌-MALE"
        },
        {
            value: "FEMALE",
            label: "谷歌-FEMALE"
        },
        {
            value: "NEUTRAL",
            label: "谷歌-NEUTRAL"
        }
    ])

    const loadData = async () => {
        try {
            let data = await http.get(`${apis.TEMPLATE_LIST}?tp=role`)
            setResponse(data)
        } catch (error) {
            
        }
    }

    const updateContent = async (obj) => {
        try {
            await http.post(apis.TEMPLATE_UPDATE,obj)
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        setLoading(true)

        loadData().then(()=>{
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

    const downLoad = async (item) => {
        setLoading(true)
        try {
            let link = await http.get(`${apis.KNOWLEDGE_LINK}?knowledge_id=${item.id}`)
            let a = document.createElement("a")
            document.body.appendChild(a)
            a.href = link
            a.target = "_blank"
            a.style.display = "none"
            a.click()
        } catch (error) {
            
        }
        setLoading(false)
    }

    const deleteKnowledge = async (item,item2) => {
        setLoading(true)
        try {
            await http.post(`${apis.KNOWLEDGE_DELETE}?knowledge_id=${item.id}&brain_id=${item2.brain_id}`)
            await loadData()
            message.success("删除成功")
        } catch (error) {
            
        }
        setLoading(false)
    }
    

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            fixed: 'left',
            width: 80
        },
        {
            title: '名字',
            dataIndex: 'role_name',
            fixed: 'left',
            width: 80
        },
        {
            title: '头像',
            dataIndex: 'role_avatar',
            width: 120,
            render: (v) => (
                <Image src={process.env.REACT_APP_OSS_URL+"/"+v} style={{width: 80,height:80}}></Image>
            )
        },
        {
            title: '描述',
            dataIndex: 'role_description',
            width: 200
        },
        {
            title: 'tts声音',
            dataIndex: 'tts_role',
            width: 80
        },
        {
            title: '知识库文件',
            dataIndex: 'knowledges',
            width: 220,
            render: (v,r)=>(
                v && <div>
                    {
                        v.map((v2,k) => (
                            <div key={k} style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}>
                                <Tooltip placement="top" title={v2.file_name}>
                                    <a style={{
                                        display: "block",
                                        width: 100,
                                        flexShrink: 0,
                                        overflow: "hidden",
                                        height: 22,
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }} key={v2.id} href={v2.id}>{v2.file_name}</a>
                                </Tooltip>
                                <div>
                                    <Button type="link" onClick={() => downLoad(v2)} icon={<DownloadOutlined />}></Button>

                                    <Popconfirm
                                        title="确定删除吗?"
                                        // description="确定删除吗?"
                                        onConfirm={() => {
                                            deleteKnowledge(v2,r)
                                        }}
                                        // onCancel={cancel}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button danger type="link" icon={<DeleteOutlined />}></Button>
                                    </Popconfirm>

                                    
                                </div>
                            </div>
                        ))
                    }
                </div>
            )
        },
        {
            title: '系统模板',
            dataIndex: 'system_prompt',
            width: 500,
            render: (v,r,dx) => (
                <div>
                    <Input.TextArea disabled value={v} onChange={e => {
                        let cpList = cloneDeep(response)
                        cpList[dx].system_prompt = e.target.value
                        setResponse(cpList)
                    }} rows={10} />
                </div>
            )
        },
        {
            title: '用户模板',
            dataIndex: 'user_prompt',
            width: 500,
            render: (v,r,dx) => (
                <div>
                    <Input.TextArea disabled onChange={e => {
                        let cpList = cloneDeep(response)
                        cpList[dx].user_prompt = e.target.value
                        setResponse(cpList)
                    }} value={v} rows={10} />
                </div>
            )
        },
        {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
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
                    <Button type="link" onClick={() => {
                        brainIdRef.current = r.brain_id
                        uploadRef.current.click()
                    }}>上传知识库</Button>
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
                        if(cpData.avatar && cpData.avatar.length !== 0){
                            cpData.role_avatar = cpData.avatar[0].path
                        }
                        await updateContent(cpData)
                        await loadData()
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
                        <Form.Item name="avatar" label="头像">
                            <Upload />
                        </Form.Item>
                        <Form.Item name="role_name" rules={[{required: true}]} label="名字">
                            <Input placeholder="请输入" />
                        </Form.Item>
                        <Form.Item name="role_description" rules={[{required: true}]} label="描述">
                            <Input.TextArea placeholder="请输入" rows={3} />
                        </Form.Item>
                        <Form.Item name="tts_role" rules={[{required: true}]} label="tts角色">
                            <Select options={ttsRoles.current} placeholder="请选择"></Select>
                        </Form.Item>
                        <Form.Item name="system_prompt" rules={[{required: true}]} label="系统提示词">
                            <Input.TextArea placeholder="请输入" rows={10} />
                        </Form.Item>
                        <Form.Item name="user_prompt" rules={[{required: true}]} label="用户提示词">
                            <Input.TextArea placeholder="请输入" rows={10} />
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
                    x: "100vw",
                    y: `calc(100vh - 280px - ${document.getElementsByClassName("ant-table-thead")[0]?.clientHeight}px)`
                }}
                rowKey={`id`} 
                columns={columns} 
                loading={loading} 
                dataSource={response || []} 
                pagination={false} />
        </div>
    )
}

export default Index