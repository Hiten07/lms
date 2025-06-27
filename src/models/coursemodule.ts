import { course } from "../models/course";
import { lessons } from "./lessons";
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  AutoIncrement,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";

@Table({ tableName: "coursemodule", paranoid: true })
export class coursemodule extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => course)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  courseid!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order!: number;

  @BelongsTo(() => course)
  coursemodule!: course;

  @HasMany(() => lessons)
  lessons!: lessons[];
}
