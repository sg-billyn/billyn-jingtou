'use strict';

import _ from 'lodash';
var Promise = require("bluebird");
import TreeTable from '../../sqldb/treeTable';
import sqldb from '../../sqldb';

export default function (sequelize, DataTypes) {
	return sequelize.define('UserGroupRole', {
		_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		userGroupId: {
			type: DataTypes.INTEGER,
			defaultValue: -1
		},
		roleId: {
			type: DataTypes.INTEGER,
			defaultValue: -1
		},
		spaceId: {
			type: DataTypes.INTEGER,
			defaultValue: -1
		},
		joinStatus: {
			type: DataTypes.ENUM,
			values: ['applying', 'following', 'joined','rejected','cancelled'],
			defaultValue: 'joined'
		},
		active: DataTypes.BOOLEAN
	}, {
			classMethods: {

			}
		}
	);
}
