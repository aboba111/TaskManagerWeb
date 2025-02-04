import React, {FormEvent, useEffect, useState} from 'react';
import {ProfileView} from "./partials/ProfileView"
import {ProfileEdit} from "./partials/ProfileEdit"
import {Button} from "antd";
import {useParams} from "react-router";
import api from "../../../app/api";
import {UserProfile} from "./types";

export const ProfilePage: React.FC = () =>{

    const [isEditMode,setIsEditMode] = useState(false)
    const [profileData, setProfileData] = useState<UserProfile | null>(null)
    const toggleMode = ()=>setIsEditMode(!isEditMode)
    const saveChange = () =>{
        fetchData();
        toggleMode();
    }
    const {id} = useParams();
    console.log(id);
    const fetchData = async () => {
            try {
                api.get(id ? `/profile/${id}` : '/profile').then(
                    (response)=>{
                        setProfileData(response.data);
                        if(!id) {
                            localStorage.setItem('userId', response.data.userId)
                        }
                    }
                )
            } catch (error) {
                console.error('Ошибка при получении изображения:', error);
            }
    };
    useEffect(() => {

        fetchData();
    }, []);

    if(!profileData){
        return(
            <span>
                Пользователь не найден
            </span>
        )
    }
    
    return (
        <div>

            {!id && isEditMode ? <ProfileEdit data={profileData}/> : <ProfileView data={profileData}/>}
            {!id &&
            <Button onClick={saveChange}>
                {isEditMode ? "go to view" : "go to edit"}
            </Button>
            }

        </div>

    )

}