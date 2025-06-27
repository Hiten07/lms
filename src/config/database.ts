import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { user } from '../models/user';
import { otp } from '../models/otp';
import { instructordetails } from '../models/instructor';
import { course } from '../models/course';
import { enrolled } from '../models/enrolled';
import { coursemodule } from '../models/coursemodule';
import { lessons } from '../models/lessons';
import { assignment } from '../models/assignment';
import { submission } from '../models/submissions';
import { trackprogress } from '../models/trackprogress';
import { Role } from '../models/Role';
import { Userrole } from '../models/Userrole';
import { Rolespermissions } from '../models/Rolespermission';
import { Permission } from '../models/Permission';

dotenv.config();

export const sequelize = new Sequelize(process.env.DB_NAME as string, process.env.DB_USERNAME as string, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST, 
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  },
  pool: {
    max: 1,   
    min: 0,
    idle: 10000,
    acquire: 30000,
  },
  logging: false, 
  models: [user, otp, instructordetails, course, enrolled, coursemodule, lessons, assignment, submission, trackprogress, Role, Userrole, Permission, Rolespermissions],
});
