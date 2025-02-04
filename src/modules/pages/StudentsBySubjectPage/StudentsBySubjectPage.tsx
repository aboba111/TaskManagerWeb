import api from "../../../app/api";
import React, {useEffect, useState} from "react";
import {StudentList, Subject} from "../../types";
import {Link, useParams} from "react-router";
import {useSelector} from "react-redux";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

type Props ={
    subject: Subject
}

export  const StudentsBySubjectPage:React.FC<{}> = () => {
    //@ts-ignore
    const userRole = useSelector((state )=>{return state.auth.role});
    const studentFlag = userRole === "STUDENT";
    const [listTaskSubject, setListTaskSubject] = useState<StudentList[]>([])
    const {subjectId} = useParams(); //subjectId
    //const {group, name} = props.subject;
    const navigate = useNavigate();
    const fetchData = async () => {
        try {
            const response = await api.get(`/catalog/student/${subjectId}`)
            setListTaskSubject(response.data);
        } catch (error) {
            console.error('Ошибка  при получении списка:', error);
        }
    };
    useEffect(() => {

        fetchData();
    }, []);
    return(
        <div>
        <div style={{display: "flex", flexDirection: "column", gap: 15}} className="box">
            {!studentFlag ? (
                listTaskSubject.map((student: StudentList) => (
                    < Link to={`/catalog/${subjectId}/${student.id}`} key={student.id}>
                        {student.name}
                    </Link>
                ))
            ) : (
                <div> Нет доступа </div>
            )
            }
        </div>
            <Button onClick={()=>navigate(`/catalog/${subjectId}/all`) }>
                создать задание для группы
            </Button>
        </div>
    )
}