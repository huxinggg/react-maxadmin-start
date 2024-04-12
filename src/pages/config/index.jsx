import React,{ useState } from "react";
import http from '../../lib/http'
import * as apis from '../../lib/api'
import { Button, message } from 'antd';
import { Editor, Toolbar } from '@wangeditor/editor-for-react'

export const editorConfig = {
    placeholder: "请输入内容...",
        MENU_CONF: {
          'uploadImage':{
            server: `${process.env.REACT_APP_API_HOST}/o/api/tool/upload`,
            maxFileSize:2 * 1024 * 1024, // 2M
            allowedFileTypes: ['jpg', 'jpeg',"png", "gif", "bmp", "webp"],
            fieldName:'file',
            headers: {
              'Authorization':  localStorage.getItem("token")
            },
            timeout: 30000, // 5 秒
            onBeforeUpload(file) {    // JS 语法
                // file 选中的文件，格式如 { key: file }
            },
            customInsert(res, insertFn) {
                insertFn(res.data.url)
            }
          },
          'uploadVideo':{
            server: `${process.env.REACT_APP_API_HOST}/o/api/tool/upload`,
            maxFileSize:100 * 1024 * 1024, // 100M
            allowedFileTypes: ["mp4", "wmv", "MOV", "avi", "mpeg"],
            meta: {
              fileType:3,
            },
            fieldName:'file',
            customInsert(res, insertFn) {
                insertFn(res.data.fileUrl)
            }
          }
        },
}

const Index = () => {
    const [editor, setEditor] = useState()
    const [html, setHtml] = useState('')


    const loadData = async () => {
        try {
            let data = await http.get(apis.B_CONFIG)
            setHtml(data.qa_html)
        } catch (error) {
            
        }
    }

    useState(()=>{
        loadData()

        if(editor){
            editor.destroy()
        }
        // eslint-disable-next-line
    },[])

    const save = async () => {
        try {
            await http.post(apis.B_CONFIG_UPDATE,{
                qa_html: html
            })
        } catch (error) {
            
        }
        message.success("保存成功")
    }


   
    return (
        <div>
            <Toolbar
                editor={editor}
                // defaultConfig={toolbarConfig}
                mode="default"
                style={{ borderBottom: '1px solid #ccc' }}
            />
            <Editor
                defaultConfig={editorConfig}
                value={html}
                onCreated={setEditor}
                onChange={editor => setHtml(editor.getHtml())}
                mode="default"
                style={{ height: '500px', overflowY: 'hidden' }}
            />
            <div style={{height: 12}}></div>
            <div style={{justifyContent: "center",display: "flex"}}>
                <Button onClick={save} type="primary">保存</Button>
            </div>
        </div>
    )
}

export default Index