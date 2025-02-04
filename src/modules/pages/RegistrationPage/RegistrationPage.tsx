import React, {useState} from 'react';

import type {FormProps} from 'antd';
import {Button, Checkbox, Form, Input, Space} from 'antd';
import {RoutesEnum} from '../../../app/routes/routes';
import {useNavigate} from "react-router-dom";
import {AppDispatch} from "../../../store";
import {useDispatch} from "react-redux";
import {login} from "../../../store/slice/authSlice";
import api from "../../../app/api";


type FieldType = {
    roleUser: string,
    surname: string,
    firstName: string,
    middleName: string,
    lastName: string,
    email: string;
    password: string;
    phoneNumber: string;
    userGroup: string | null;
};


export const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const handleRegistration = async (values: FieldType) => {
        try {
            const response  = await api.post("/register", {...values});
            if(response.status===201)
                navigate("/login");

        } catch (error) {
            console.error("Login error", error);

        }
    };


    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
        handleRegistration(values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
            <h1>Регистрация</h1>
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
                    label="Роль"
                    name="roleUser"
                    rules={[{required: true, message: 'Обязательное поле!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Фамилия"
                    name="surname"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Имя"
                    name="firstName"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Отчество"
                    name="middleName"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Почта"
                    name="email"
                    rules={[{required: true, message: 'Please input your password!'}]}
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

                <Form.Item<FieldType>
                    label="Телефон"
                    name="phoneNumber"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Группа"
                    name="userGroup"
                >
                    <Input/>
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        отправить
                    </Button>
                </Form.Item>


            </Form>
        </div>
    );
};