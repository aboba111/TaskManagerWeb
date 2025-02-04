import {Button, Tree, TreeDataNode} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../app/api";
import {useSelector} from "react-redux";
import {useParams} from "react-router";


type Task ={
    id: number,
    name: string,
    parentId: number
}

export const StudentTasksPage = () => {
    const [data, setData] = useState<TreeDataNode[]>([]);
    const [dataGroup, setDataGroup] = useState<TreeDataNode[]>([]);
    const {subjectId, studentId} = useParams();

    //@ts-ignore
    const userRole = useSelector((state )=>{return state.auth.role});
    const canCreate = userRole === "ADMIN";

    const fetchData = async (flagGroup: boolean)=>{
        let response;
        if(!flagGroup) {
            response = await api.get(`/catalog/${subjectId}/${studentId}`);
        }else{
            response = await api.get(`/catalog/${subjectId}`);
        }
        const map: Record<number, TreeDataNode> = {};
        const tree: TreeDataNode[] = [];
        response.data.forEach((item: Task)=>{
            map[item.id] = {title: item.name, key: item.id, children: []};
        });
        response.data.forEach((item: Task)=>{
            if(!item.parentId){
                tree.push(map[item.id])
            }else {
                if(map[item.parentId]){
                    map[item.parentId].children?.push(map[item.id])
                }
            }
        })
        if(!flagGroup) {
            setData(tree);
        }else{
            setDataGroup(tree);
        }
    }

    useEffect(()=>{
        if(studentId!=="all")
            fetchData(false);
        fetchData(true);
    },[])
    const navigate = useNavigate();

    const onSelect = (selectedKeys: React.Key[], info: any) => {
        navigate(`/task/${info.node.key}`);
    };

    const handleGoTo = () =>{
        navigate(`/createTask/${subjectId}/${studentId}`);
    }
    const handleGroupGoTo = () =>{
        navigate(`/createTask/${subjectId}/${'all'}`);
    }


    return(
        <div>
            {studentId!=="all" && <div>
                <div style={{padding: '0 40px'}} className="box">
                <h1>Каталог заданий</h1>
                <Tree
                    showLine={true}
                    onSelect={onSelect}
                    treeData={data}
                />
            </div>
            {canCreate &&
                <Button onClick={handleGoTo}>
                    добавить задание
                </Button>
            }
            </div>}

            <div style={{padding: '0 40px'}} className="box">
                <h1>Групповой каталог заданий</h1>
                <Tree
                    showLine={true}
                    onSelect={onSelect}
                    treeData={dataGroup}
                />
            </div>
            {canCreate &&
                <Button onClick={handleGroupGoTo}>
                    добавить задание
                </Button>
            }
        </div>
    )
}

