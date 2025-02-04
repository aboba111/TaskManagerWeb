import api from "../../../app/api";
import {useEffect, useState} from "react";
import {Subject} from "../../types";
import {Link} from "react-router";
import {useSelector} from "react-redux";

export const SubjectsPage: React.FC<{}> = () => {
    //@ts-ignore
    const userRole = useSelector((state) => {
        //@ts-ignore
        return state.auth.role
    });
    const userId = localStorage.getItem("userId");
    const studentFlag = userRole === "STUDENT";
    const [listTaskSubject, setListTaskSubject] = useState<Subject[]>([])
    const fetchData = async () => {
        try {
            const response = await api.get("/catalog/subject")
            setListTaskSubject(response.data);
        } catch (error) {
            console.error('Ошибка  при получении списка:', error);
        }
    };
    useEffect(() => {

        fetchData();
    }, []);
    return (
        <div style={{display: "flex", flexDirection: "column", gap: 15}}>
            {studentFlag ? (
                listTaskSubject.map((subject: Subject) => (
                    < Link to={`/catalog/${subject.id}/${userId}`} key={subject.id}>
                        {subject.name}
                    </Link>
                ))
            ) : (
                listTaskSubject.map((subject: Subject) => (
                        <div>
                            <h3>{subject.group}</h3>
                            < Link to={`/catalog/${subject.id}`} key={subject.id}>
                                {subject.name}
                            </Link>
                        </div>
                    )
                )
            )
            }
        </div>
    )
}