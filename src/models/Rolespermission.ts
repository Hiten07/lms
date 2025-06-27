import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { Role } from "../models/Role";
import { Permission } from "../models/Permission";

@Table({ tableName: "rolespermissions", timestamps: true, paranoid: false })
export class Rolespermissions extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roleid!: number;

  @ForeignKey(() => Permission)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  permissionid!: number;

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
}
