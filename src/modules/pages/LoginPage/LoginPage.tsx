import React, {useState} from 'react';

import type {FormProps} from 'antd';
import {Button, Checkbox, Form, Input, Space} from 'antd';
import {RoutesEnum} from '../../../app/routes/routes';
import {useNavigate} from "react-router-dom";
import {AppDispatch} from "../../../store";
import {useDispatch} from "react-redux";
import {login} from "../../../store/slice/authSlice";


type FieldType = {
    email: string;
    password: string;
};


export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const handleLoginClick = async (values: FieldType) => {
        const {email, password} = values;
        try {
            const resultAction = await dispatch(login({email, password}));
            if (login.fulfilled.match(resultAction)) {
                navigate(RoutesEnum.Profile);
            }
        } catch (error) {
            console.error("Login error", error);
        }
    };


    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
        handleLoginClick(values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const handleRegistration = () => {
        navigate(RoutesEnum.Registration);
    }
    const  handleResetPassword =() =>{
        navigate(RoutesEnum.ResetPassword);
    }
    return (
        <div>
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                style={{maxWidth: 600}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Почта"
                    name="email"
                    rules={[{required: true, message: 'Please input your username!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Пароль"
                    name="password"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        войти
                    </Button>
                </Form.Item>
                <Form.Item label={null} className="box">
                    <Button onClick={handleRegistration}>
                        регистрация
                    </Button>
                </Form.Item>
                <Form.Item label={null} className="box">
                    <Button onClick={handleResetPassword}>
                        сбросить пароль
                    </Button>
                </Form.Item>


            </Form>

        </div>
    );
};