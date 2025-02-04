export type CommentDtoForm ={
    taskId: number,
    text: string,
}
export type CommentsDto ={
    comments: CommentDtoForm[]
}
export type CommentDto = {
    comment: string,
    user: string,
    date: string
}