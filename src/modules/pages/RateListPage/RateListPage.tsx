import api from "../../../app/api";
import {useEffect, useState} from "react";
import {AttendTable, RateTable} from "../../types";
import {Link} from "react-router";

export  const RateListPage: React.FC<{}> = () => {
    const [listRates, setListRates] = useState<RateTable[]>([])
    const fetchData = async () => {
        try {
            const response = await api.get("/rates")
            setListRates(response.data);
        } catch (error) {
            console.error('Ошибка при получении изображения:', error);
        }
    };
    useEffect(() => {

        fetchData();
    }, []);
    return(
        <div style={{display: "flex", flexDirection: "column", gap: 15}}>
            {
                listRates.map((rateTable: RateTable) => (
                    < Link to={`/rates/${rateTable.id}`} key={rateTable.id}>
                        {rateTable.name}
                    </Link>
                ))
            }
        </div>
    )
}