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
import { user } from "../models/user";

@Table({ tableName: "peerlearning", timestamps: true, paranoid: false })
export class peerlearning extends Model {
  @Column
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => user)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  helperid!: number;

  @ForeignKey(() => user)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  learnerid!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  topic!: string;

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
