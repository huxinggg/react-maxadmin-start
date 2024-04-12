import React,{ useEffect, useRef, useState } from "react";
import http from '../../lib/http'
import * as apis from '../../lib/api'
import { Table,Input, message, Button, Modal } from 'antd';
import { cloneDeep } from "lodash"


const Index = () => {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [update, setUpdate] = useState(new Date().getTime())
    const [tempTxt, setTempTxt] = useState('')
    const [open, setOpen] = useState(false)
    const curData = useRef()

    const loadData = async () => {
        try {
            let data = await http.get(`${apis.TEMPLATE_LIST}?tp=free`)
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
    

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            fixed: 'left',
            width: 80
        },
        {
            title: '名字',
            dataIndex: 'name',
            fixed: 'left',
            width: 80
        },
        {
            title: '类型',
            dataIndex: 'tp',
            fixed: 'left',
            width: 80
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
                    <div style={{height: 12}}></div>
                    <Button type="primary" onClick={() => {
                        curData.current = {record: r, type: "system"}
                        setTempTxt(v)
                        setOpen(true)
                    }}>编辑</Button>
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
                    <div style={{height: 12}}></div>
                    <Button type="primary" onClick={() => {
                        curData.current = {record: r, type: "user"}
                        setTempTxt(v)
                        setOpen(true)
                    }}>编辑</Button>
                </div>
            )
        },
        {
            title: '备注',
            dataIndex: 'remark',
            width: 200
        }
    ];

    return (
        <div>
            <span style={{display: "none"}}>{update}</span> 
            <Modal
                title="编辑提示词"
                open={open}
                forceRender
                onCancel={()=>{
                    setOpen(false)
                }}
                okButtonProps={{loading}}
                onOk={async () => {
                    setLoading(true)
                    if(curData.current.type === "system"){
                        curData.current.record.system_prompt = tempTxt
                    }else{
                        curData.current.record.user_prompt = tempTxt
                    }
                    await updateContent(curData.current.record)
                    setLoading(false)
                    setOpen(false)
                    message.success("更新成功")
                }}
            >
                <Input.TextArea value={tempTxt} rows={20} onChange={e => {
                    setTempTxt(e.target.value)
                }} />
            </Modal>           
            <Table 
                scroll={{
                    x: "100vw",
                    y: `calc(100vh - 230px - ${document.getElementsByClassName("ant-table-thead")[0]?.clientHeight}px)`
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