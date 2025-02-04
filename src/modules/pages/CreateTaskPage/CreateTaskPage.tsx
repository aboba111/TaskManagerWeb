
import React, {useEffect, useState} from 'react';

import type {FormProps} from 'antd';
import {Button, Checkbox, Form, Input, Space, Select} from 'antd';
import {useLocation, useNavigate} from "react-router-dom";
import api from "../../../app/api";
import {useParams} from "react-router";
import {useSelector} from "react-redux";

type FieldType = {
    name: string;
    description: string;
    parentId: number|null;
};
type Task ={
    value: number,
    label: string
}
type TaskResponse ={
    id: number,
    name: string,
}
export const CreateTaskPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [parentId, setParentId] = useState<number|null>(null);
    const navigate = useNavigate();
    const {subjectId, studentId} = useParams();
    //@ts-ignore
    const userRole = useSelector((state )=>{return state.auth.role});
    const studentFlag = userRole === "ADMIN";
    const handleCreateTask= async (values: FieldType ) => {
        let response;
        console.log(subjectId)
        if(studentId === "all"){
            response = await api.post(`/catalog/${subjectId}`, {...values, parentId});

        }else {
    response = await api.post(`/catalog/${subjectId}/${studentId}`, {...values, parentId});
    }
    // приходит айди задания котое уже создал
    if(response.status===201){
        navigate(`/task/${response.data.id}`);
    }
    };


    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
        handleCreateTask(values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const fetchAllTasks =async ()=>{
        let response;
        if(studentId === "all"){
            response = await api.get(`/catalog/short/${subjectId}`);

        }else {
            response = await api.get(`/catalog/short/${subjectId}/${studentId}`);
        }
        setTasks(response.data.map((task:TaskResponse) => {
            return {value: task.id, label: task.name}
        }));

    }

    const changeParentTasks =( newValue: number) =>{
       setParentId(newValue)
    }

    useEffect(()=>{
        fetchAllTasks();
    },[]
    )

    return (
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
                label="Название"
                name="name"
                rules={[{required: true, message: 'Обязательное поле name!'}]}
            >
                <Input/>
            </Form.Item>

            <Form.Item<FieldType>
                label="Описание"
                name="description"
                rules={[{required: true, message: 'Обязательное поле !'}]}
            >
                <Input.TextArea/>
            </Form.Item>

            <Form.Item<FieldType>
                label="Родительское задание"
                name="parentId"
            >
                <Select options={tasks} onChange={changeParentTasks} value={parentId}/>
            </Form.Item>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    создать задание
                </Button>
            </Form.Item>


        </Form>
    );
}