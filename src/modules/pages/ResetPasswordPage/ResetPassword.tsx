import React, {useState} from 'react';

import type {FormProps} from 'antd';
import {Button, Checkbox, Form, Input, Space} from 'antd';
import {RoutesEnum } from '../../../app/routes/routes';
import {useNavigate} from "react-router-dom";
import { AppDispatch } from "../../../store";
import { useDispatch } from "react-redux";
import { login } from "../../../store/slice/authSlice";
import api from "../../../app/api";


type FieldType = {
    email: string;
};


export const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const handleLoginClick= async (values: FieldType ) => {
        const {email} = values;
        const config = {email: email}
        try {
            const response = await api.post("/recover", config)
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
    const handleResetPassword =()=>{
        navigate(RoutesEnum.Login);
    }
    return (
        <div>
            <h1>Восстановление пароля</h1>
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

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        восстановить
                    </Button>
                </Form.Item>


            </Form>

        </div>
    );
};