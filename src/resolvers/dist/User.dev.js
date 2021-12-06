"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongodb = require("mongodb");

var _mongoOrder = _interopRequireDefault(require("utils/mongoOrder"));

var _dayjs = _interopRequireDefault(require("dayjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  User: {
    id: function id(parent) {
      return regeneratorRuntime.async(function id$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", parent.id || parent._id);

            case 1:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    fullName: function fullName(parent) {
      return regeneratorRuntime.async(function fullName$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", "".concat(parent.firstName, " ").concat(parent.lastName));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      });
    },
    age: function age(parent) {
      return regeneratorRuntime.async(function age$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", (0, _dayjs["default"])(new Date().getTime()).diff(new Date(parent.birthDate).toLocaleString(), 'year', true));

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      });
    } // age: async (parent) =>dayjs(parent.birthday).format('DD/MM/YYYY')

  },
  Query: {
    allUsers: function allUsers(_, args, _ref) {
      var mongo, first, skip, orderBy, limit, offset, obj;
      return regeneratorRuntime.async(function allUsers$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              mongo = _ref.mongo;
              first = args.first, skip = args.skip, orderBy = args.orderBy;
              limit = first || 10;
              offset = skip || 0;
              obj = mongo.User.find({});
              if (first !== undefined) obj.limit(limit);
              if (skip !== undefined) obj.skip(offset);
              if (orderBy) obj.sort((0, _mongoOrder["default"])(orderBy));else obj.sort({
                _id: -1
              }); // -1 = DESC

              _context4.next = 10;
              return regeneratorRuntime.awrap(obj.toArray());

            case 10:
              return _context4.abrupt("return", _context4.sent);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      });
    },
    getUser: function getUser(_, args, _ref2) {
      var mongo, user;
      return regeneratorRuntime.async(function getUser$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              mongo = _ref2.mongo;

              if (!args.id) {
                _context5.next = 7;
                break;
              }

              _context5.next = 4;
              return regeneratorRuntime.awrap(mongo.User.findOne({
                _id: (0, _mongodb.ObjectId)(args.id)
              }));

            case 4:
              _context5.t0 = _context5.sent;
              _context5.next = 8;
              break;

            case 7:
              _context5.t0 = null;

            case 8:
              user = _context5.t0;
              return _context5.abrupt("return", user);

            case 10:
            case "end":
              return _context5.stop();
          }
        }
      });
    }
  },
  Mutation: {
    createUser: function createUser(_, args, context) {
      var mongo, _ref3, insertedId, createdUser;

      return regeneratorRuntime.async(function createUser$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              mongo = context.mongo;
              _context6.next = 3;
              return regeneratorRuntime.awrap(mongo.User.insertOne(args));

            case 3:
              _ref3 = _context6.sent;
              insertedId = _ref3.insertedId;
              _context6.next = 7;
              return regeneratorRuntime.awrap(mongo.User.findOne({
                _id: insertedId
              }));

            case 7:
              createdUser = _context6.sent;
              return _context6.abrupt("return", {
                success: true,
                user: createdUser
              });

            case 9:
            case "end":
              return _context6.stop();
          }
        }
      });
    },
    updateUser: function updateUser(_, args, context) {
      var mongo, updateUser;
      return regeneratorRuntime.async(function updateUser$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              mongo = context.mongo;
              _context7.next = 3;
              return regeneratorRuntime.awrap(mongo.User.updateOne({
                _id: (0, _mongodb.ObjectId)(args.id)
              }, {
                "$set": {
                  firstName: args.firstName,
                  lastName: args.lastName,
                  birthDate: args.birthDate
                }
              }));

            case 3:
              _context7.next = 5;
              return regeneratorRuntime.awrap(mongo.User.findOne({
                _id: (0, _mongodb.ObjectId)(args.id)
              }));

            case 5:
              updateUser = _context7.sent;
              return _context7.abrupt("return", {
                success: true,
                lifeEvent: updateUser
              });

            case 7:
            case "end":
              return _context7.stop();
          }
        }
      });
    },
    deleteUser: function deleteUser(_, args, context) {
      var mongo, deleteUser;
      return regeneratorRuntime.async(function deleteUser$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              mongo = context.mongo;
              _context8.next = 3;
              return regeneratorRuntime.awrap(mongo.User.findOne({
                _id: (0, _mongodb.ObjectId)(args.id)
              }));

            case 3:
              deleteUser = _context8.sent;

              if (!(deleteUser !== null)) {
                _context8.next = 10;
                break;
              }

              _context8.next = 7;
              return regeneratorRuntime.awrap(mongo.User.deleteOne({
                _id: (0, _mongodb.ObjectId)(args.id)
              }));

            case 7:
              return _context8.abrupt("return", {
                success: true,
                message: "Complete",
                user: deleteUser
              });

            case 10:
              return _context8.abrupt("return", {
                success: true,
                message: "Not found",
                user: null
              });

            case 11:
            case "end":
              return _context8.stop();
          }
        }
      });
    }
  }
};
exports["default"] = _default;