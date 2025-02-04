import { Card } from 'antd';
import {FC} from 'react'

interface IProps {
    comment: string;
    user: string;
    date: string;
}

export const CommentItem: FC<IProps> = ({ comment, user, date }) => {
    return (
        <Card size="small" title={user} extra={date} style={{ textAlign: 'left', width: 300 }}>
            <p>{comment}</p>
        </Card>
    )
}
