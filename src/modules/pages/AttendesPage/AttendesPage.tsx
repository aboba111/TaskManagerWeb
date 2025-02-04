import { useEffect, useState } from "react";
import {Link, useParams} from "react-router";
import api from "../../../app/api";
import {AttendTable, DataType, Student} from "../../types";
import {Space, Table, TableProps} from "antd"
import { Cell } from "./Cell"
import { Row } from "./Row"
import {useSelector} from "react-redux";
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';

type ColumnType = Exclude<TableProps<DataType>["columns"], undefined >

const generateColumns = (year: number, month: number, canEdit: boolean ) =>{
    const date = new Date(year, month - 1, 1);
    const days : (ColumnType[number] & {
        editable : boolean,
        dataIndex: string
    })[] = [];
    while(date.getMonth() === month - 1){
        const currentDate = new Date(date);
        const formattedDate =  currentDate.toLocaleDateString("ru-Ru");
        const formattedDay =  currentDate.getDate();
        days.push(
            {
                title: formattedDay,
                width: 20,
                dataIndex: formattedDate,
                editable: canEdit,
                render: (value)=> {
                    return value==="+" || value===true ? "+": "-"
                }
            }
        );
        date.setDate(date.getDate() + 1);
    }
    return days;
}

const components = {
    body: {
        cell: Cell,
        row: Row
    }
}

export  const AttendesPage: React.FC<{}> = () => {
    //@ts-ignore
    const userRole = useSelector((state )=>{return state.auth.role});
    const canEdit = userRole === "ADMIN";
    console.log(canEdit);
    const [tableData, setTableData] = useState<AttendTable | null >(null)

    const [dataSource, setDataSource] = useState<DataType[] | null>(null)

    const defaultColumns: (ColumnType[number] & {
        editable : boolean,
        dataIndex: string
    })[] =
        tableData ?
        [
            {
                title: 'id',
                width: 100,
                dataIndex: 'id',
                fixed: 'left',
                editable: false
            },
        {
            title: 'Студент',
            width: 100,
            dataIndex: 'name',
            fixed: 'left',
            editable: false
        },
        // получение года и месяца у тбалицы
        ...generateColumns(tableData?.year, tableData?.month, canEdit)
    ] : []

    const columns = defaultColumns.map((col)=>{
        if(!col.editable){
            return col
        }
        return {
            ...col,
            onCell: (record: DataType)=>{
                return {
                    tableId: tableData?.id,
                    studentId: record.id,
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave,
                }
            }
        }
    })

    const handleSave = (row: DataType) =>{
        if(!dataSource)
            return;
        const newData = [...dataSource]
        const index = newData.findIndex((item)=>{
            return item.id === row.id
        })
        const item = newData[index];
        newData.splice(index, 1,{...item, ...row});
        setDataSource(newData);
    }
    const {id} = useParams();
    const fetchData = async (date: Date) => {
        try {
            const config = {
                params: {
                    year: date.getFullYear(),
                    month: date.getMonth()+1,
                }
            }
            const response = await api.get(`/attendes/${id}`, config)
            const students: DataType[] = response.data.students.map((student: Student)=>{
                let attends : Record<string, boolean> = {};
                student.attends?.forEach((attend)=>{
                    attends[attend.date] = attend.value;
                })
                //@ts-ignore
                const row: DataType = {
                    name: student.name,
                    id: student.id,
                    ...attends
                }
                return row
            });
            const {id: tableId, name, year, month} = response.data;
            setTableData({id: tableId, name, year, month});
            setDataSource(students);
        } catch (error) {
            console.error('Ошибка ри получении данных таблицы:', error);
        }
    };
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        fetchData(date ? date.toDate() : new Date())
    };

    useEffect(() => {
        fetchData(new Date());
    }, []);

    if (!tableData) {
        return(
            <span>
                таблица не найдена
            </span>
        )
    }

    return(
        <div style={{ padding: '0 40px'}}>
           <h1>{tableData.name}</h1>
            <Space direction="vertical">
                <DatePicker onChange={onChange} picker="month" />
            </Space>
            <Table<DataType>
                bordered
                columns={columns as ColumnType}
                dataSource={dataSource || []}
                scroll={{ x: 'max-content' }}
                pagination={false}
                components={components}
            />
        </div>
    )
}