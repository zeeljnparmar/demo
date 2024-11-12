import * as dotenv from 'dotenv';
dotenv.config()


export const jwt = process.env.jwt;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_PASSWORD= `${String(process.env.DB_Password)}`;
export const DB_USER = process.env.DB_USER;


//? APi Responses
export const notFound='No such data Found'
export const unexpexted='An Error has Occured'
export const success='Task done Successfully'
export const Unauthorized='User Not Authorized for this action'