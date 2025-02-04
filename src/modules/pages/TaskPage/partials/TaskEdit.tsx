import {Button, Checkbox, Input, Upload, UploadProps} from "antd";
import api from "../../../../app/api";
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {PlusOutlined, UploadOutlined} from "@ant-design/icons";
import {TaskForm} from "../types";
import {AxiosRequestConfig} from "axios";
import {useParams} from "react-router";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {Outlet} from "react-router-dom";

type Props = {
    data: TaskForm;
};
type TaskPageForm = {
    text: string;
}

export const TaskEdit: React.FC<Props> = (props) => {
    const { id } = useParams();
    const { data } = props;
    const method = useForm<TaskPageForm>({defaultValues: {text : data.text}})
    const onSubmit = async (taskPageData: TaskPageForm) => {
        const config = {headers: {"Content-Type": 'application/json'}}
        await api.post(`/taskPage/${id}`,taskPageData, config);
        data.text = taskPageData.text;
        console.log(data)
    }

    const [photos, setPhotos] = useState<string[]>([]);
    const [link, setLink] = useState<string[]>([]);

    const fetchImage = async (linkImage: string): Promise<string> => {
        try {
            const config: AxiosRequestConfig = { responseType: "arraybuffer" };
            const response = await api.get(`/taskPage/image/${linkImage}`, config);
            const arrayByte = new Uint8Array(response.data);
            const blob = new Blob([arrayByte], { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            return url;
        } catch (error) {
            console.error('Ошибка при получении изображения:', error);
            return ''; // Возвращаем пустую строку в случае ошибки
        }
    };

    useEffect(() => {
        const fetchPhotos = async () => {
            const myLinks = props.data?.links?.split(',');
            if(myLinks===undefined)
                return;
            setLink(myLinks)
            const imageUrls = await Promise?.all(myLinks?.map(async (linkImage) => {
                return await fetchImage(linkImage);
            }));
            setPhotos(imageUrls?.filter(url => url !== ''));

        };

        fetchPhotos();
    }, []);

    const handleDelete = async (index: number) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        const linkOnServer = link[index];
        const response = await api.delete(`/taskPage/image/${id}`, {
            params:
                {
                    linkOnServer
                }
        });
        setPhotos(newPhotos);
    };
    const uploadImage: UploadProps['customRequest'] = async ({file}) => {

        const formData = new FormData();
        formData.append('file', file);
        const config = {headers: {"Content-Type": 'multipart/form-data'}}
        const response = await api.post(`/taskPage/image/${id}`, formData, config);
    }

    return (
        <div style={{maxHeight: "inherit"}}>
            <div>
                <FormProvider {...method} >
                    <form onSubmit={method.handleSubmit(onSubmit)}>
                        <div style={{
                            display: 'block',
                            //display: 'flex',
                            flexDirection: 'column',
                            margin: '0 20px',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Controller
                                name="text"
                                control={method.control}
                                render={({field}) => {
                                    return (
                                        <Input.TextArea {...field}
                                                        defaultValue={data.text}
                                                        style={{
                                                            padding: '10px',
                                                            width: 'calc(100% - 400px)',
                                                            boxSizing: 'border-box',
                                                        }}
                                        />

                                    )
                                }}/>
                        </div>
                        <div className="box">
                            <Button htmlType={"submit"}>
                                save
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
            {photos?.map((photo, index) => (
                <div key={index} style={{margin: '10px', position: 'relative'}}>
                    <img src={photo} alt={"avatar"} style={{width: '150px', height: '150px', objectFit: 'cover'}}/>
                    <button
                        onClick={() => handleDelete(index)}
                        style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}
                    >
                        &times;
                    </button>
                </div>
            ))}
            <Upload
                name="avatar"
                listType={"picture"}
                className="avatar-uploader"
                showUploadList={false}
                customRequest={uploadImage}
            >
                <Button icon={<UploadOutlined/>} className="box">Добавить фото</Button>
            </Upload>
        </div>
    );
};