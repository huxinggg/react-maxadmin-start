import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from '../components/layout'
import rsConfig from './config'
import * as utils from '../utils'

const routerData = utils.routerHandle(rsConfig)

const R = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    {
                        routerData?.map((v,k) => (
                            !v.layout && <Route key={k} path={v.path} element={v.component} />
                        ))
                    }
                    <Route path="/*" element={
                        <Layout>
                            <Routes>
                                {
                                    routerData?.map((v,k) => (
                                        v.layout && <Route key={k} path={v.path} element={v.component} />
                                    ))
                                }
                            </Routes>
                        </Layout> 
                    } />
                    
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default R
