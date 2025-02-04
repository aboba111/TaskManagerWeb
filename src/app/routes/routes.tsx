import {TestPage} from "../../modules/pages/TestPage/TestPage";
import {RouteObject} from "react-router-dom";
import {AuthPage} from "../authPage/AuthPage";
import {
    ProfilePage,
    RatePage,
    AttendesListPage,
    LoginPage,
    StudentTasksPage,
    AttendesPage,
    RateListPage,
    TaskPage,
    CreateTaskPage,
    RegistrationPage,
    SubjectsPage,
    StudentsBySubjectPage,
    ResetPasswordPage
} from "../../modules/pages";
import React from "react";
import {Controller} from "react-hook-form";
import CommentsPage from "../../modules/pages/CommentsPage/CommentsPage";



export const enum RoutesEnum {
    Comments = "/comments/:id",
    Test = "/test",
    Login = "/login",
    Profile = "/profile",
    ProfileId = "/profile/:id",
    Task = "/task/:id",
    Attendes = "/attendes",
    AttendesId = "/attendes/:id",
    Rates = "/rates",
    RatesId = "/rates/:id",
    Root = "/",
    CreateTask = "/createTask/:subjectId/:studentId",
    Registration = "/registration",
    Subjects = "/catalog", //отображается список предметов
    StudentsBySubject = "/catalog/:subjectId", // отображается список студентов по предмету
    StudentTasks = "/catalog/:subjectId/:studentId", // отображается список заданий для студента
    ResetPassword = "/reset"
}

export const routes: RouteObject[] = [
    {
        path: RoutesEnum.Login,
        element: (
                <LoginPage />
        ),
    },
    {
        path: RoutesEnum.Registration,
        element: (
            <RegistrationPage />
        ),
    },
    {
        path: RoutesEnum.Test,
        element: (
                <TestPage />
        ),
    },
    {
        path: RoutesEnum.ResetPassword,
        element: (
            <ResetPasswordPage />
        ),
    },
    {
        path: RoutesEnum.Root,
        element: (
            <AuthPage />
        ),
        children: [
            {  path: RoutesEnum.Profile,
                element: (
                    <ProfilePage />
                ),

            },
            {  path: RoutesEnum.ProfileId,
                element: (
                    <ProfilePage />
                ),

            },
            {
                path: RoutesEnum.StudentTasks,
                element: (
                    <StudentTasksPage />
                ),
            },
            {
                path:  RoutesEnum.Attendes,
                element: (
                    <AttendesListPage />
                )

            },
            {
                path:  RoutesEnum.AttendesId,
                element: (
                    <AttendesPage />
                )

            },
            {
                path: RoutesEnum.Rates,
                element: (
                    <RateListPage/>
                )
            },
            {
                path: RoutesEnum.RatesId,
                element: (
                    <RatePage/>
                )
            },
            {
                path: RoutesEnum.CreateTask,
                element: (
                    <CreateTaskPage />
                )
            },
            {
                path: RoutesEnum.Subjects,
                element: (
                    <SubjectsPage />
                )
            },
            {
                path: RoutesEnum.StudentsBySubject,
                element: (
                    <StudentsBySubjectPage />
                )
            },
            {
                path: RoutesEnum.Task,
                element: (
                    <TaskPage/>
                )
            },
            {
                path: RoutesEnum.Comments,
                element: (
                    <CommentsPage/>
                )
            },

            ]
    },

];