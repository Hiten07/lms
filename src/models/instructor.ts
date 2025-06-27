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
  BelongsTo,
} from "sequelize-typescript";
import { user } from "../models/user";

@Table({ tableName: "instructordetails", timestamps: true, paranoid: true })
export class instructordetails extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => user)
  @Column({
    type: DataType.INTEGER,
  })
  userid!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  qualification!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bio!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  experience!: number;

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

  @BelongsTo(() => user)
  instructordetails?: user;
}
