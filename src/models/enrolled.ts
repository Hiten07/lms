import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";

import { user } from "../models/user";
import { course } from "../models/course";

@Table({ tableName: "enrolled", timestamps: true, paranoid: true })
export class enrolled extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => user)
  @Column({
    type: DataType.INTEGER,
  })
  userid!: number;

  @ForeignKey(() => course)
  @Column({
    type: DataType.INTEGER,
  })
  courseid!: number;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  enrolleddate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  validuntildate!: Date;


  @BelongsTo(() => user)
  users!: user;

  @BelongsTo(() => course)
  courses!: course;
}
