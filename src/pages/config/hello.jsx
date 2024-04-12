import React,{ useEffect, useState } from "react";
import http from '../../lib/http'
import * as apis from '../../lib/api'
import { Table,Input, message, Button, Modal } from 'antd';


const Index = () => {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [update, setUpdate] = useState(new Date().getTime())
    const [tempTxt, setTempTxt] = useState('')
    const [open, setOpen] = useState(false)
    const [tempRecord, setTempRecord] = useState({})

    const loadData = async () => {
        try {
            let data = await http.get(`${apis.CONFIG_HELLO_LIST}`)
            setResponse(data)
        } catch (error) {
            
        }
    }

    // const updateContent = async (obj) => {
    //     try {
    //         await http.post(apis.TEMPLATE_UPDATE,obj)
    //     } catch (error) {
            
    //     }
    // }

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
            title: '类型',
            dataIndex: 'face_num',
            fixed: 'left',
            width: 80,
            render: (v,r,dx) => (
                v === 1 ? '首次':'非首次'
            )
        },
        {
            title: '页面',
            dataIndex: 'page',
            fixed: 'left',
            width: 80,
            render: (v,r,dx) => (
                <>
                    {
                        v === "article" && '文章页'
                    }
                    {
                        v === "free_page" && '画板页'
                    }
                    {
                        v === "start_page" && '首页'
                    }
                </>
                
            )
        },
        {
            title: '内容',
            dataIndex: 'content',
            width: 500,
            render: (v,r,dx) => (
                <div style={{whiteSpace: "pre-wrap"}}>{v}</div>
            )
        },
        {
            title: '操作',
            dataIndex: 'page',
            fixed: 'right',
            width: 80,
            render: (v,r,dx) => (
                <Button onClick={() => {
                    setTempRecord(r)
                    setTempTxt(r.content)
                    setOpen(true)
                }}>编辑</Button>
            )
        }
    ];

    return (
        <div>
            <span style={{display: "none"}}>{update}</span> 
            <Modal
                title="编辑"
                open={open}
                forceRender
                onCancel={()=>{
                    setOpen(false)
                }}
                okButtonProps={{loading}}
                onOk={async () => {
                    setLoading(true)
                    await http.post(apis.CONFIG_HELLO_UPDATE,{
                        id: tempRecord.id,
                        content: tempTxt
                    })
                    await loadData()
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
                pagination={false} 
            />
        </div>
    )
}

export default Index