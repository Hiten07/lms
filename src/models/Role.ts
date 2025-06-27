import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  BelongsToMany,
} from "sequelize-typescript";
import { user } from "../models/user";
import { Rolespermissions } from "./Rolespermission";
import { Userrole } from "./Userrole";
import { Permission } from "../models/Permission";

@Table({ tableName: "roles", timestamps: true, paranoid: true })
export class Role extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  rolename!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

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

  @BelongsToMany(() => user, () => Userrole)
  Users!: user[];

  @BelongsToMany(() => Permission, () => Rolespermissions)
  Permissions!: Permission[];
}
