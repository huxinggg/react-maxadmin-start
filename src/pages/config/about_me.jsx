import React,{ useState } from "react";
import http from '../../lib/http'
import * as apis from '../../lib/api'
import { Button,message } from 'antd';
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import {editorConfig} from './index'


const Index = () => {
    const [editor, setEditor] = useState()
    const [html, setHtml] = useState('')


    const loadData = async () => {
        try {
            let data = await http.get(apis.B_CONFIG)
            setHtml(data.about_html)
        } catch (error) {
            
        }
    }

    const save = async () => {
        try {
            await http.post(apis.B_CONFIG_UPDATE,{
                about_html: html
            })
        } catch (error) {
            
        }
        message.success("保存成功")
    }

    useState(()=>{
        loadData()

        if(editor){
            editor.destroy()
        }
        // eslint-disable-next-line
    },[])


   
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