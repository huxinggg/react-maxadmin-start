import Login from '../pages/login'
import Home from '../pages/home'
import { Breadcrumb } from 'antd';
import Template from '../pages/template'
import TemplateFree from '../pages/template/free'
import TemplateWWWW from '../pages/template/www'
import Tutor from '../pages/template/tutor'
import Hello from '../pages/config/hello'
import Channel from '../pages/config/channel'
import Article from '../pages/article'
import ArticleCreate from '../pages/article/create'

import { AppstoreAddOutlined, HomeOutlined } from '@ant-design/icons';

const style = {
    margin: '16px 0',
}

const cv = {
    "/": {
        icon: <HomeOutlined />,
        component: <Home />,
        layout: true,
        breadcrumb: <Breadcrumb style={style}>
            <Breadcrumb.Item>主页</Breadcrumb.Item>
        </Breadcrumb>
    },
    "/template": {
        icon: <AppstoreAddOutlined />
    },
    "/template/list": {
        component: <Template />,
        layout: true,
        breadcrumb: <Breadcrumb style={style}>
            <Breadcrumb.Item>提示词模板</Breadcrumb.Item>
            <Breadcrumb.Item>列表</Breadcrumb.Item>
        </Breadcrumb>
    },
    "/template/list/free": {
        component: <TemplateFree />,
        layout: true,
        breadcrumb: <Breadcrumb style={style}>
            <Breadcrumb.Item>提示词模板</Breadcrumb.Item>
            <Breadcrumb.Item>画板模式</Breadcrumb.Item>
        </Breadcrumb>
    },
    "/template/list/www": {
        component: <TemplateWWWW />,
        layout: true,
        breadcrumb: <Breadcrumb style={style}>
            <Breadcrumb.Item>提示词模板</Breadcrumb.Item>
            <Breadcrumb.Item>搜索模式</Breadcrumb.Item>
        </Breadcrumb>
    },
    "/template/tutor": {
        component: <Tutor />,
        layout: true,
        breadcrumb: <Breadcrumb style={style}>
            <Breadcrumb.Item>提示词模板</Breadcrumb.Item>
            <Breadcrumb.Item>Tutor</Breadcrumb.Item>
        </Breadcrumb>
    },
    "/config": {
        icon: <AppstoreAddOutlined />
    },
    "/config/hello": {
        component: <Hello />,
        layout: true,
        breadcrumb: <Breadcrumb style={style}>
            <Breadcrumb.Item>配置管理</Breadcrumb.Item>
            <Breadcrumb.Item>AI打招呼</Breadcrumb.Item>
        </Breadcrumb>
    },
    "/config/channel": {
        component: <Channel />,
        layout: true,
        breadcrumb: <Breadcrumb style={style}>
            <Breadcrumb.Item>配置管理</Breadcrumb.Item>
            <Breadcrumb.Item>YouTube频道</Breadcrumb.Item>
        </Breadcrumb>
    },
    "/article": {
        icon: <AppstoreAddOutlined />
    },
    "/article/list": {
        component: <Article />,
        layout: true,
        breadcrumb: <Breadcrumb style={style}>
            <Breadcrumb.Item>文章管理</Breadcrumb.Item>
            <Breadcrumb.Item>文章列表</Breadcrumb.Item>
        </Breadcrumb>
    },
    "/article/create": {
        component: <ArticleCreate />,
        layout: true,
        hideMenu: true,
        breadcrumb: <Breadcrumb style={style}>
            <Breadcrumb.Item>文章管理</Breadcrumb.Item>
            <Breadcrumb.Item>新建文章</Breadcrumb.Item>
        </Breadcrumb>
    },
    "/login": {
        component: <Login />,
        layout: false
    }
}

export default cv