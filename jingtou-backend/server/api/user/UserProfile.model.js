'use strict';

module.exports = function(sequelize, DataTypes) {
  var UserProfile = sequelize.define('UserProfile', {

    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    spaceId: {
      type: DataTypes.INTEGER,
      default: -100 // for all space
    },
    circleId: {
      type: DataTypes.INTEGER,
      default: -100 // for all circle
    },
    roleId: {
      type: DataTypes.INTEGER,
      default: -100 // for all role
    },
    name: DataTypes.STRING,
    familyname: DataTypes.STRING,
    surname: DataTypes.STRING,
    nickname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'The specified email address is already in use.'
      },
      validate: {
        isEmail: true
      }
    },
    mobile: {
      type: DataTypes.STRING,
      unique: {
        msg: 'The specified mobile is already in use.'
      },
      validate: {
        isNumberic: true
      }
    },
    address: {
      type: DataTypes.STRING,
    },
    description: DataTypes.STRING,
  }, {

    /**
     * Virtual Getters
     */
     getterMethods: {
    },

    /**
     * Pre-save hooks
     */
     hooks: {
    },

    /**
     * Instance Methods
     */
     instanceMethods: {
      
     }
  });

return UserProfile;
};
