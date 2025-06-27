import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  BeforeUpdate,
  HasMany,
  BelongsToMany,
  HasOne,
} from "sequelize-typescript";
import { course } from "../models/course";
import { enrolled } from "./enrolled";
import { instructordetails } from "./instructor";
import { submission } from "./submissions";
import bcrypt from "bcrypt";
import { Role } from "./Role";
import { Userrole } from "./Userrole";

export enum userRole {
  ADMIN = "admin",
  INSTRUCTOR = "instructor",
  STUDENT = "student",
}

@Table({
  scopes: {
    students: {
      where: { role: "student" },
    },
    instructors: {
      where: { role: "instructor" },
    },
    withEmail(email: string) {
      return {
        where: { email },
      };
    },
  },
  tableName: "users",
  timestamps: true,
  paranoid: true,
})

export class user extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstname!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastname!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  phonenumber!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  // @Column({
  //   type: DataType.ENUM("student", "instructor"),
  //   allowNull: false,
  // })
  // role!: string;

  @CreatedAt
  @Column({
    field: "createdAt",
  })
  createdAt?: Date;

  @UpdatedAt
  @Column({
    field: "updatedAt",
  })
  updatedAt?: Date;

  @HasOne(() => instructordetails)
  instrucion!: instructordetails;

  @HasMany(() => course, "instructorid")
  instructor!: course[];

  @HasMany(() => enrolled)
  students!: enrolled;

  @BelongsToMany(() => course, () => enrolled)
  users!: course[];

  @HasMany(() => submission)
  submissions!: submission[];
  
  @BelongsToMany(() => Role, () => Userrole)
  Roles!: Role[];

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: user) {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }
}

