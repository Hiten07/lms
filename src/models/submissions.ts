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
import { course } from "../models/course";
import { user } from "../models/user";
import { assignment } from "../models/assignment";

@Table({ tableName: "submissions", timestamps: true, paranoid: true })
export class submission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
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

  @ForeignKey(() => assignment)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  assignmentid!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  submissionUrl!: string;

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

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  isaccepted!: boolean;

  @BelongsTo(() => user)
  students!: user;
}
