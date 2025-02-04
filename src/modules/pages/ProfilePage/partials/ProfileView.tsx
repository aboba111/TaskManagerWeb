import {Upload, UploadProps} from "antd";
import api from "../../../../app/api";
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {UserProfile} from "../types";
import {AxiosRequestConfig} from "axios";
import {useParams} from "react-router";

type Props = {
    data : UserProfile
}

export  const ProfileView: React.FC<Props> = (props) => {
    const {id} = useParams();

    const {data} = props;

    const [imageUrl, setImageUrl] = useState('');


    const fetchImage = async () => {
        try {
            const config:AxiosRequestConfig= {responseType: "arraybuffer"};

            api.get(id ? `/profile/image/${id}` : '/profile/image', config).then((response) => {
                const arrayByte = new Uint8Array(response.data)
                const blob = new Blob([arrayByte], { type: 'image/jpeg' });
                const url = URL.createObjectURL(blob);
                setImageUrl(url);
                console.log(imageUrl)
            });
        } catch (error) {
            console.error('Ошибка при получении изображения:', error);
        }
    };
    useEffect(() => {

        fetchImage();
    }, []);

    console.log(imageUrl)
    return (
        <div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {imageUrl && (
                <img src={imageUrl}
                     alt="avatar"
                     style={{
                         width: '100px',
                         height: '100px',
                         marginRight: '16px'
                     }} // Добавьте отступ справа от изображения
                />
            )}
            <div style={{textAlign: 'left'}} className="box">
                <span>фамилия: {data.surname}</span><br/>
                <span>имя: {data.firstName}</span><br/>
                <span>отчество: {data.middleName}</span><br/>
                <span>роль: {data.userRole}</span><br/>
            </div>
        </div>
            <div className="box">
                <span> Обо мне</span><br/>
                <span>{data.description}</span><br/>
            </div>
        </div>
    )
}