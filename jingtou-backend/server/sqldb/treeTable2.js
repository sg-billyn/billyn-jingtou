var _ = require('lodash');
var Promise = require('bluebird');
//import * as db from './index';

function TreeTable(context) {

    this.context = context;

    this.addChild = function (parentObj, childData) {
        var childName;
        var owner;
        var ownerId;
        var spaceId;
        var appId;
        var Model;
        var parentFullname;
        var parentId;

        if (typeof parentObj === 'object') {
            Model = parentObj.Model;
            for (var key in parentObj) {

                if (key.toLowerCase() === 'id') {
                    parentId = parentObj[key];
                    //delete parentObj[key];
                }

                if (key.toLowerCase() === '_id') {
                    parentId = parentObj[key];
                    //delete parentObj[key];
                }

                if (key.toLowerCase() === 'owner') {
                    owner = parentObj[key];
                    //delete parentObj[key];
                }
                if (key.toLowerCase() === 'ownerid') {
                    ownerId = parentObj[key];
                    //delete parentObj[key];
                }
                if (key.toLowerCase() === 'spaceid') {
                    spaceId = parentObj[key];
                    //delete parentObj[key];
                }
                if (key.toLowerCase() === 'appid') {
                    appId = parentObj[key];
                    //delete parentObj[key];
                }
            }

            parentFullname = parentObj.fullname;
        }

        if (typeof childData === 'string') {
            childName = childData;
            childData = {};
            childData.name = childName;
        }

        if (typeof childData === 'object') {
            //console.log('childData 2: ', JSON.stringify(childData));
            for (var key in childData) {
                if (key.toLowerCase() === 'name' || key.toLowerCase() === 'childname') {
                    childName = childData[key];
                    delete childData[key];
                }
                if (key.toLowerCase() === 'owner') {
                    owner = childData[key];
                    delete childData[key];
                }
                if (key.toLowerCase() === 'ownerid') {
                    ownerId = childData[key];
                    delete childData[key];
                }
                if (key.toLowerCase() === 'spaceid') {
                    spaceId = childData[key];
                    delete childData[key];
                }
                if (key.toLowerCase() === 'appid') {
                    appId = childData[key];
                    delete childData[key];
                }
            }
        }
        //console.log('childName:',childName);

        var childContext = {};

        childContext.fullname = parentFullname + "." + childName;
        childContext.parentId = parentId;

        if (owner) {
            childContext.owner = owner;
        }
        if (ownerId && ownerId !== -1) {
            childContext.ownerId = ownerId;
        }
        if (spaceId && spaceId !== -1) {
            childContext.spaceId = spaceId;
        }
        if (appId && appId !== -1) {
            childContext.appId = appId;
        }

        childData = Object.assign(parentObj, childData);
        childData.fullname = parentFullname + "." + childName;
        if (childData['_id']) {
            delete childData['_id'];
        }

        if (childData['_id']) {
            delete childData['_id'];
        }

        return Model.findOrCreate({
            where: childContext,
            defaults: childData
        }).spread(function (entity, created) {
            if (created) {
                return Promise.resolve(entity);
            } else {
                return entity.update(childData);
            }
        })
    }

    this.getChildren = function (parent, options) {
        var owner;
        var ownerId;
        var spaceId;
        var appId;
        var Model;
        var parentFullname;
        var parentId;
        var isRecursive = false;
        var childData;
        var childContext = {};

        if (options === true) {
            isRecursive = true;
        }

        if (typeof options === 'object' && options.recursive === true) {
            isRecursive = true;
            delete options['recursive'];
        }

        if (typeof parentObj === 'object') {
            Model = parentObj.Model;
            for (var key in parentObj) {

                if (key.toLowerCase() === 'id') {
                    parentId = parentObj[key];
                    //delete parentObj[key];
                }

                if (key.toLowerCase() === '_id') {
                    parentId = parentObj[key];
                    //delete parentObj[key];
                }

                if (key.toLowerCase() === 'owner') {
                    owner = parentObj[key];
                    //delete parentObj[key];
                }
                if (key.toLowerCase() === 'ownerid') {
                    ownerId = parentObj[key];
                    //delete parentObj[key];
                }
                if (key.toLowerCase() === 'spaceid') {
                    spaceId = parentObj[key];
                    //delete parentObj[key];
                }
                if (key.toLowerCase() === 'appid') {
                    appId = parentObj[key];
                    //delete parentObj[key];
                }
            }

            parentFullname = parentObj.fullname;
        }

        if (typeof options === 'string') {
            childContext.fullname = parentFullname + "."+ options;
        }

        if (typeof options === 'object') {
            //console.log('childData 2: ', JSON.stringify(childData));
            childContext = Object.assign(childContext, options);
        }

        if (owner) {
            childContext.owner = owner;
        }
        if (ownerId && ownerId !== -1) {
            childContext.ownerId = ownerId;
        }
        if (spaceId && spaceId !== -1) {
            childContext.spaceId = spaceId;
        }
        if (appId && appId !== -1) {
            childContext.appId = appId;
        }

        if (isRecursive === true) {
            childContext.fullname = {
                $like: parentFullname + '%'
            }
        } else {
            childContext.parentId = parentId;
        }

        return Model.findAll(
            {
                where: childContext
            }
        );

    }

    this.getChild = function (parent, childData) {
        return this.getChildren(parent, childData).then(function(results){
            return Promise.resolve(results[0]);
        })
    }

    this.getParent = function (child) {

    }

    this.removeChild = function (parent, childContext) {

    }

    this.hasChild = function (parent) {

    }

    this.isChildOf = function (parent, child) {

    }

    this.isParentOf = function (child, parent) {

    }

    this.getCountOfChildren = function (parent) {

    }
}

module.exports = TreeTable;