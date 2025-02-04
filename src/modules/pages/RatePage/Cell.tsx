import { PropsWithChildren, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Input, InputRef, Form } from "antd";
import {EditableContext} from "./EditableContext";
import {DataType} from "../../types";
import api from "../../../app/api";
import {useSelector} from "react-redux";

type Props = {
    title: ReactNode;
    editable: boolean;
    dataIndex: string;
    record: DataType;
    handleSave: (record: DataType) => void;
    tableId: number,
    studentId: number
}

export  const Cell: React.FC<PropsWithChildren<Props>> = ({ tableId, studentId, title, editable, dataIndex, record, handleSave, children, ...restProps }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext);


    useEffect(()=>{
        if (editing) {
            inputRef.current?.focus()
        }
    },[editing])


    const toggleEdit =() =>{
        setEditing(!editing)
        form?.setFieldsValue({

            [dataIndex]: record[dataIndex]===undefined ? " ": record[dataIndex]
        })
    }

    const save = async () =>{
        const values = await form?.validateFields();
        const date = Object.keys(values)[0];
        const rate = Number(Object.values(values)[0]);
        console.log(rate)
        const oldValue = record[dataIndex]===undefined ? " ": record[dataIndex]
        const config = {studentId, date: date, rate: rate }
        if(!rate || rate===oldValue){
            toggleEdit();
            return;
        }
        if(rate!==undefined ) {
            await api.post(`/rates/${tableId}`, config)
        }else {
            await api.delete(`/rates/${tableId}`, {
                params:
                    {
                        ...config
                    }
            })
        }
        toggleEdit();
        handleSave({ ...record, ...values });
    }

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0, width: 40 }}
                name={dataIndex}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingInlineEnd: 24, width: 40, textAlign: "center" }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
}