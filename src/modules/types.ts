export type DataType = {
    [attend: string]: string | boolean| number

}
export type Student = {
    name: string,
    id: number,
    attends?: {
        date: string,
        value: boolean
    }[]
}
export type StudentRate = {
    name: string,
    id: number,
    rates?: {
        date: string,
        rate: number
    }[]
}
export type AttendTable ={
    id : string,
    name: string,
    students?: DataType[],
    year: number,
    month: number
}

export type RateTable ={
    id : string,
    name: string,
    students?: DataType[],
    year: number,
    month: number
}

export type Comment ={
    id : string,
    tableId: string,
    date: string,
    text: string,
}

export type Subject ={
    id: string,
    group: string,
    name: string
}
export type StudentList ={
    id: string,
    name: string
}