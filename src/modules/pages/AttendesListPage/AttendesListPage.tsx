import api from "../../../app/api";
import {useEffect, useState} from "react";
import {AttendTable} from "../../types";
import {Link} from "react-router";

export  const AttendesListPage: React.FC<{}> = () => {
    const [listAttendes, setListAttendes] = useState<AttendTable[]>([])
    const fetchData = async () => {
        try {
            const response = await api.get("/attendes")
            setListAttendes(response.data);
        } catch (error) {
            console.error('Ошибка  при получении списка:', error);
        }
    };
    useEffect(() => {

        fetchData();
    }, []);
    return(
        <div style={{display: "flex", flexDirection: "column", gap: 15}}>
            {
                listAttendes.map((attendTable: AttendTable) => (
                   < Link to={`/attendes/${attendTable.id}`} key={attendTable.id}>
                       {attendTable.name}
                   </Link>
                ))
            }
        </div>
    )
}