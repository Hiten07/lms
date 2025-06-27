import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  BelongsToMany
} from "sequelize-typescript";
import { Rolespermissions } from "../models/Rolespermission";
import { Role } from "../models/Role";

@Table({ tableName: "permissions", timestamps: true, paranoid: true })
export class Permission extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  permissionname!: string;

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

  @BelongsToMany(() => Role, () => Rolespermissions)
  Roles!: Role[];
}
