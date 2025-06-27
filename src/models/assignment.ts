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
  BelongsTo
} from "sequelize-typescript";
import { course } from "../models/course";

@Table({ tableName: "assignments", timestamps: true, paranoid: true })
export class assignment extends Model {
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
    type: DataType.DATE,
    allowNull: false,
  })
  duedate!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  assignmentUrl!: string;

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


  @BelongsTo(() => course)
  courses!: course;
}
