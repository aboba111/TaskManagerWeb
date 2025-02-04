import {Form} from "antd";
import {EditableContext} from "./EditableContext";

type Props = {
   index: number
}

export const Row : React.FC<Props> = ({ index, ...props})=> {
   const [form] = Form.useForm()

   return(
       <Form key={index} form={form} component={false}>
          <EditableContext.Provider value={form}>
              <tr {...props} />
          </EditableContext.Provider>
       </Form>
   )

}