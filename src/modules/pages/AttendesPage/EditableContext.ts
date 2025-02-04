import {Form, GetRef} from "antd";
import {createContext} from "react";


type FormType<T> = GetRef<typeof  Form<T>>
export const EditableContext = createContext<FormType<any>|null>(null)