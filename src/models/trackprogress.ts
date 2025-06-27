import { user } from "../models/user";
import { course } from "../models/course";
import { lessons } from "../models/lessons";
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

@Table({ tableName: "trackprogress", timestamps: true, paranoid: false })
export class trackprogress extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @ForeignKey(() => user)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userid!: number;

  @ForeignKey(() => course)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  courseid!: number;

  @ForeignKey(() => lessons)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  lessonid!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  iscompleted!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  completedAt!: Date;

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

  // @BelongsTo(() => lessons)
  // lessons!: lessons;
}
