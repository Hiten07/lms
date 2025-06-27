import { coursemodule } from "../models/coursemodule"
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    AutoIncrement,
    AllowNull,
    BelongsTo,
    HasMany,
  } from "sequelize-typescript";
import { course } from "./course";
import { trackprogress } from "./trackprogress";

  @Table({tableName: "lessons", paranoid: true})
  export class lessons extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => coursemodule)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    moduleid!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    title!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    description!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    videoUrl!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null
    })
    fileUrl!: string;

    @BelongsTo(() => coursemodule) 
    module!: coursemodule

    // @HasMany(() => progress)
    // progress!: progress[];

  }