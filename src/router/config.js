import Login from '../pages/login'
import Home from '../pages/home'
import Store from '../pages/store'
import Banner from '../pages/banner'
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';

const style = {
    margin: '16px 0',
}

const data = [
    {
        path: "/",
        component: <Home />,
        name: "首页",
        icon: <HomeOutlined />,
        layout: true,
        breadcrumb: <Breadcrumb style={style}>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
        </Breadcrumb>
    },
    {
        path: "/mall",
        component: <Home />,
        name: "商城管理",
        icon: <HomeOutlined />,
        layout: true,
        children: [
            {
                path: "/store",
                component: <Store />,
                name: "门店信息",
                icon: <HomeOutlined />,
                layout: true,
                breadcrumb: <Breadcrumb style={style}>
                    <Breadcrumb.Item>商城管理</Breadcrumb.Item>
                    <Breadcrumb.Item>门店信息</Breadcrumb.Item>
                </Breadcrumb>
            },
            {
                path: "/banner",
                component: <Banner />,
                name: "轮播图",
                icon: <HomeOutlined />,
                layout: true,
                breadcrumb: <Breadcrumb style={style}>
                    <Breadcrumb.Item>商城管理</Breadcrumb.Item>
                    <Breadcrumb.Item>轮播图</Breadcrumb.Item>
                </Breadcrumb>
            }
        ]
    },
    {
        path: "/login",
        component: <Login />,
        name: "",
        icon: <HomeOutlined />,
        layout: false
    }
]

export default data