import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from '../components/layout'
import menuConfig from './config'
import {globalContext as GlobalContext} from '../components/context'
import { useState, useEffect } from "react";
import http from '../lib/http'
import * as apis from '../lib/api'
import { HomeOutlined } from '@ant-design/icons';

const R = () => {
    const [data, setData] = useState()
    const [menuItemData, setMenuItemData] = useState([])

    const onLoad = async () => {
        const dataret = await http.get(apis.USER_INFO)
        if(!dataret.permission_info || (dataret.permission_info && dataret.permission_info.length === 0)){
            return "抱歉，该账号没有权限"
        }
        const supers = []
        for(let i=0;i<dataret?.permission_info?.length;i++){
            let item = dataret.permission_info[i]
            if(!menuConfig[item.path]){
                continue
            }
            item.key = item.path
            item.label = item.name
            item.icon = menuConfig[item.path].icon
            if(item.super_id === 0){
                supers.push(item)
            }
        }
        for(let i=0;i<dataret?.permission_info?.length;i++){
            let item = dataret.permission_info[i]
            let f = supers.findIndex(v => v.id === item.super_id)
            if(f !== -1 && !menuConfig[item.path]?.hideMenu){
                if(!supers[f].children){
                    supers[f].children = [item]
                }else{
                    supers[f].children.push(item)
                }
            }
        }
        //所有角色都有个首页权限
        supers.unshift({
            id: 1,
            key: "/",
            label: "首页",
            name: "首页",
            path: "/",
            icon: <HomeOutlined />
        })
        setMenuItemData(supers)
        setData(dataret)
    }
    useEffect(()=>{
        if(window.location.pathname === "/login"){
            return
        }
        onLoad()
    },[])

    return (
        <GlobalContext.Provider value={{
            roleData: data,
            menuItemData,
            onLoad
          }}>
            <BrowserRouter>
                <Routes>
                    {
                        data?.permission_info?.map((v,k) => (
                            (menuConfig[v.path] && !menuConfig[v.path].layout) && <Route key={k} path={v.path} element={menuConfig[v.path].component} />
                        ))
                    }
                    <Route key={"login"} path="login" element={menuConfig["/login"].component} />
                    <Route path="/*" element={
                        <Layout>
                            <Routes>
                                {
                                    data?.permission_info?.map((v,k) => (
                                        (menuConfig[v.path] && menuConfig[v.path].layout) && <Route key={k} path={v.path} element={menuConfig[v.path].component} />
                                    ))
                                }
                                <Route key={"home"} path="/" element={menuConfig["/"].component} />
                            </Routes>
                        </Layout> 
                    } />
                </Routes>
            </BrowserRouter>
        </GlobalContext.Provider>
    )
}

export default R
