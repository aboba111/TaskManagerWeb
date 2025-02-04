import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectToken} from "../../store/slice/authSlice";
import {Outlet, useNavigate} from "react-router-dom";
//import {RoutesEnum} from "../routes/routes";
import {Button, Layout, Menu, MenuProps} from "antd"

export const enum RoutesEnum {
    Test = "/test",
    Login = "/login",
    Profile = "/profile",
    Subjects = "/catalog",
    Attendes = "/attendes",
    Rates = "/rates",
    Root = "/",
}

type MenuItem = Required<MenuProps>['items'][number];
const items:  MenuItem[] = [{
    label: "профиль",
    key: RoutesEnum.Profile
}, {
    label: "посещаемость",
    key: RoutesEnum.Attendes
}, {
    label: "оценки",
    key: RoutesEnum.Rates
}, {
    label: "каталог заданий",
    key: RoutesEnum.Subjects
}]

export const AuthPage: React.FC = () =>{
    const {Header, Content} = Layout;
    const token = useSelector(selectToken);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() =>{
        if(!token){
            navigate(RoutesEnum.Login);
        }
    }, [])
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        navigate(e.key);
    };
    const [current, setCurrent] = useState(window.location.pathname);
    const handleLogout =()=>{
        dispatch(logout());
        navigate(RoutesEnum.Login);



    }
    return (
        <Layout>
            <Header style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: '4 1 auto'}}>
                    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{backgroundColor: 'transparent'}} />
                </div>
                <div style={{ flex: '1', display: 'flex', justifyContent: 'center' }}>
                    <Button style={{ width: '100px' }} onClick={handleLogout}>Log out</Button>
                </div>
            </Header>
            <Content style={{ maxWidth: '100vw', minHeight: 'calc(100vh - 60px)' ,  paddingTop: '100px' }}>
                <Outlet />
            </Content>
        </Layout>
    );
};
