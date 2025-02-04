import {Input, Upload, Button, UploadProps, Checkbox} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {Controller, FormProvider, useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch, RootState} from "../../../../store";
import { useSelector } from 'react-redux';
import {test} from "../../../../store/slice/userSlice";
import api from "../../../../app/api";
import {ProfileView} from "./ProfileView";
import {UserProfile} from "../types";
import {AxiosRequestConfig} from "axios";


type ProfileForm = {
    description: string;
    notification: boolean;
    //imageId: string;
}
type Props = {
    data : UserProfile
}

export const ProfileEdit: React.FC<Props> = (props) => {


    const {data} = props;
    const dispatch = useDispatch<AppDispatch>();
    const handleClick = async () => {
        const response = await api.get('/profile');
    }

    const method = useForm<ProfileForm>({defaultValues: {description : data.description}})
    const onSubmit = async (profileData: ProfileForm) => {
        const config = {headers: {"Content-Type": 'application/json'}}
        await api.post('/profile',profileData, config);
        data.description= profileData.description;
        // event.preventDefault();
        console.log(data)
        // return method.handleSubmit((data)=>{ console.log(data)})
    }
    const [imageUrl, setImageUrl] = useState<string>('');
    //@ts-ignore
    const myValue = useSelector((state) => state.auth.access);
    const uploadImage: UploadProps['customRequest'] = async ({file}) => {

        const formData = new FormData();
        formData.append('file', file);
        const config = {headers: {"Content-Type": 'multipart/form-data', "Authorization": `Bearer ${myValue}` }}
        //const config = {headers: {"Content-Type": 'multipart/form-data'}}
        const response = await api.post('/profile/image', formData, config);
        //@ts-ignore
        setImageUrl(URL.createObjectURL(file));
        //@ts-ignore
        //method.setValue('imageId', response.id)
    }
    const fetchImage = async () => {
        try {
            const config:AxiosRequestConfig= {responseType: "arraybuffer"};
            api.get('/profile/image', config).then((response) => {
                const arrayByte = new Uint8Array(response.data)
                const blob = new Blob([arrayByte], { type: 'image/jpeg' });
                const url = URL.createObjectURL(blob);
                setImageUrl(url);
            });
        } catch (error) {
            console.error('Ошибка при получении изображения:', error);
        }
    };
    useEffect(() => {

        fetchImage();
    }, []);

    return (
        <div>
            <Upload
                name="avatar"
                listType={imageUrl ? "picture" : "picture-circle"}
                className="avatar-uploader"
                showUploadList={false}
                customRequest={uploadImage}
            >
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {imageUrl ? (<div>
                                {Boolean(imageUrl) && (
                                    <img src={imageUrl || ""}
                                         alt="avatar"
                                         style={{
                                             width: '100px',
                                             height: '100px',
                                             marginRight: '16px'
                                         }} // Добавьте отступ справа от изображения
                                    />
                                )}
                            </div>
                        )
                        :
                        (
                            <div>
                                <PlusOutlined/>
                                <div style={{marginTop: 8}}>Upload</div>
                            </div>
                        )
                    }
                <div style={{textAlign: 'left'}}>
                    <span>фамилия: {data.surname}</span><br/>
                    <span>имя: {data.firstName}</span><br/>
                    <span>отчество: {data.middleName}</span><br/>
                    <span>роль: {data.userRole}</span><br/>
                </div>
                </div>
            </Upload>
            <FormProvider {...method}>
                <form onSubmit={method.handleSubmit(onSubmit)}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: '0 20px',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <label htmlFor="name">Обо мне</label>
                        <Controller
                            name="description"
                            control={method.control}
                            render={({field}) => {
                                return (
                                    <Input.TextArea {...field}
                                                    defaultValue={data.description}
                                                    style={{
                                                        padding: '10px',
                                                        width: 'calc(100% - 400px)',
                                                        boxSizing: 'border-box',
                                                    }}
                                    />

                                )
                            }}/>
                        <Controller render={({field})=>{
                            return (
                                < Checkbox {...field}>
                                    разрешить отправку уведомлений
                                </Checkbox>
                            )
                        }} name={"notification"}/>
                        <div className="box">
                            <Button htmlType={"submit"}>
                                save
                            </Button>
                        </div>

                    </div>
                </form>
            </FormProvider>
        </div>
    )
}