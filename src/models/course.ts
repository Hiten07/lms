import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    BelongsTo,
    ForeignKey,
    BelongsToMany,
    HasMany,
  } from "sequelize-typescript";
  import { user } from '../models/user';
  import { enrolled } from '../models/enrolled';
import { assignment } from "./assignment";
import { coursemodule } from "./coursemodule";

  @Table({tableName: 'courses',timestamps: true,paranoid: true})


  export class course extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  courseid!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  coursename!: string;


  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  courseprice!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  duration!: number;

  @ForeignKey(() => user)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  instructorid!: number;

  @BelongsTo(() => user,"instructorid")
  instructor!: user;

  @BelongsToMany(() => user, () => enrolled)
  students!: user[];

  @HasMany(() => assignment) 
  assignments!: assignment[]

  @HasMany(() => enrolled)
  courses!: enrolled[];

  @HasMany(() => coursemodule) 
  coursemodules!: coursemodule[];
}