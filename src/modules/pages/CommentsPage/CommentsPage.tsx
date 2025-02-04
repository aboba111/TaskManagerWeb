import { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { CommentDto } from "./type";
import { Loading3QuartersOutlined } from '@ant-design/icons';
import {CommentItem} from './components/CommentsItem'
import {Button, Input, Space } from 'antd';
import {Controller, useForm} from 'react-hook-form'
import api from "../../../app/api";

interface CommentFormData {
    comment: string,
    user: string,
    date: string
}


const CommentsPage = () => {
    const { id } = useParams();
    const [comments, setComments] = useState<CommentDto[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [sending, setSending] = useState<boolean>(false)

    const { control, handleSubmit, reset } = useForm<CommentFormData>({
        defaultValues: { comment: '' },
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const data = await api.get(`/comment/${id}`)
                //@ts-ignore
                setComments(data.data)
                console.log("отввет", data.data)
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const onSubmit = async (data: CommentFormData) => {

        try {
            setSending(true)
            await api.post(`/comment/${id}`,  {comment: data.comment})
            const newComment: CommentDto = {
                comment: data.comment,
                user: data.user, // Сюда подставить имя пользователя после регистрации
                date: data.date,
            }
            console.log('Comment: ', newComment)

            setComments(prevComments => [...prevComments, newComment])

            reset();
        } catch (e) {
            console.log(e)
        } finally {
            setSending(false)
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: '20px' }}>
                <Controller
                    name="comment"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input.TextArea
                            {...field}
                            placeholder="Введите комментарий"
                            autoSize={{ minRows: 3, maxRows: 6 }}
                            style={{ marginBottom: '10px' }}
                        />
                    )}
                />
                <Button loading={sending} type="primary" htmlType="submit">
                    Отправить
                </Button>
            </form>
            {
                loading
                    ? <Loading3QuartersOutlined style={{ fontSize: '32px' }} spin />
                    : (
                       comments && <Space direction="vertical" size={16}>
                            {comments?.map((comment, index) => {
                                return (
                                    <CommentItem key={index} {...comment} />
                                )
                            })}
                        </Space>
                    )
            }
        </div>
    );
};

export default CommentsPage;