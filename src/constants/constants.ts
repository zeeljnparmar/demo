import * as dotenv from 'dotenv';
dotenv.config()


export const jwt = process.env.jwt;
export const DB_URL = process.env.DB_URL;


//? APi Responses
export const notFound='No such data Found'
export const unexpexted='An Error has Occured'
export const success='Task done Successfully'
export const Unauthorized='User Not Authorized for this action'
export const exists ='Data Already Exists'