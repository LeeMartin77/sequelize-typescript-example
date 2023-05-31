import { DataTypes, ModelDefined, Optional, Sequelize } from "sequelize";

export const sequelize = new Sequelize('sqlite::memory:');

export interface UserAttributes {
    id: number;
    name: string;
}

type UserCreationAttributes = UserAttributes;

const User: ModelDefined<
    UserAttributes,
    UserCreationAttributes
> = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: new DataTypes.STRING(64),
      allowNull: false
    }
  },
  {
    tableName: 'users'
  }
);

export interface NoteAttributes {
    id: number;
    title: string;
    userId: number;
    content: string;
}

type NoteCreationAttributes = NoteAttributes;

const Note: ModelDefined<
  NoteAttributes,
  NoteCreationAttributes
> = sequelize.define(
  'Note',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: new DataTypes.STRING(64),
      defaultValue: 'Unnamed Note'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: new DataTypes.STRING(4096),
      allowNull: false
    }
  },
  {
    tableName: 'notes'
  }
);

User.hasMany(Note, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'notes'
})

Note.belongsTo(User, {
    targetKey: 'id',
    foreignKey: 'userId',
    as: 'user'
})

export const models = {
    User,
    Note
}