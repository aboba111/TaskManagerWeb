import {Button, Checkbox, Input, Upload, UploadProps} from "antd";
import api from "../../../../app/api";
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {PlusOutlined, UploadOutlined} from "@ant-design/icons";
import {TaskForm} from "../types";
import {AxiosRequestConfig} from "axios";
import {useParams} from "react-router";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {Outlet, useNavigate} from "react-router-dom";
import {RoutesEnum} from "../../../../app/routes/routes";

type Props = {
    data: TaskForm;
};
type TaskPageForm = {
    text: string;
}

export const TaskView: React.FC<Props> = (props) => {
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
            if(imageUrls===undefined)
                return;
            setPhotos(imageUrls?.filter(url => url !== ''));

        };

        fetchPhotos();
    }, []);
    const navigate = useNavigate();
    const  handleComments =() =>{
        navigate(`/comments/${id}`);
    }

    return (
        <div style={{maxHeight: "inherit"}}>
            <div>
                {data?.text}
            </div>
            {photos?.map((photo, index) => (
                <div key={index} style={{margin: '10px', position: 'relative'}}>
                    <img src={photo} alt={"avatar"} style={{width: '150px', height: '150px', objectFit: 'cover'}}/>
                </div>
            ))}
            <Button onClick={handleComments}>
                комментарии
            </Button>
        </div>
    );
};