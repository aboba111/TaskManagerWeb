import React, {FormEvent, useEffect, useState} from 'react';
import {TaskView} from "./partials/TaskView"
import {TaskEdit} from "./partials/TaskEdit"
import {Button} from "antd";
import {useParams} from "react-router";
import api from "../../../app/api";
import {TaskForm} from "./types";
import {useSelector} from "react-redux";

export const TaskPage: React.FC = () =>{

    const [isEditMode,setIsEditMode] = useState(false)
    const [profileData, setProfileData] = useState<TaskForm | null>(null)
    const toggleMode = ()=>setIsEditMode(!isEditMode)
    const saveChange = () =>{
        fetchData();
        toggleMode();
    }
    //@ts-ignore
    const userRole = useSelector((state )=>{return state.auth.role});
    const teacherFlag = userRole === "ADMIN";
    const {id} = useParams();
    console.log(id);
    const fetchData = async () => {
        try {
            api.get(`/taskPage/${id}`).then(
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
        <div >
            <h2>Материал</h2>

            {teacherFlag && isEditMode ? <TaskEdit data={profileData}/> : <TaskView data={profileData}/>}
            {teacherFlag &&
                <Button onClick={saveChange}>
                    {isEditMode ? "go to view" : "go to edit"}
                </Button>
            }

        </div>

    )

}