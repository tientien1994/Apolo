import { ObjectId } from 'mongodb'
import buildMongoOrders from 'utils/mongoOrder'
import  dayjs from 'dayjs'

export default {
  User: {
    id: async (parent) => parent.id || parent._id,
    fullName: async (parent) => `${parent.firstName} ${parent.lastName}`,
    age: async (parent) => dayjs(new Date().getTime()).diff(new Date(parent.birthDate).toLocaleString(),'year', true)
    // age: async (parent) =>dayjs(parent.birthday).format('DD/MM/YYYY')
  },
  Query: {
    allUsers: async (_, args, { mongo }) => {
      const { first, skip, orderBy } = args

      const limit = first || 10
      const offset = skip || 0
      const obj = mongo.User.find({})

      if (first !== undefined) obj.limit(limit)
      if (skip !== undefined) obj.skip(offset)

      if (orderBy) obj.sort(buildMongoOrders(orderBy))
      else obj.sort({ _id: -1 }) // -1 = DESC

      return await obj.toArray()
    },
    getUser: async (_, args, { mongo }) => {
      const user = args.id ? await mongo.User.findOne({ _id: ObjectId(args.id) }) : null

      return user
    },
  },

  Mutation: {
    createUser: async (_, args, context) => {
      const { mongo } = context

      const { insertedId } = await mongo.User.insertOne(args)
      const createdUser = await mongo.User.findOne({ _id: insertedId })

      return {
        success: true,
        user: createdUser
      }
    },
    updateUser: async (_, args, context) => {
      const { mongo } = context

      await mongo.User.updateOne({ _id: ObjectId(args.id)},{
        "$set":{
          firstName: args.firstName,
          lastName: args.lastName,
          birthDate: args.birthDate
        }
      })
      const updateUser = await mongo.User.findOne({ _id: ObjectId(args.id) })

      return {
        success: true,
        lifeEvent: updateUser
      }
    },
    deleteUser: async (_, args, context) => {
      const { mongo } = context

      const deleteUser = await mongo.User.findOne({ _id: ObjectId(args.id) })
      if(deleteUser!== null){
        await mongo.User.deleteOne({ _id: ObjectId(args.id)})
        return {
          success: true,
          message:"Complete",
          user: deleteUser
        }
      }else{
        return {
          success: true,
          message:"Not found",
          user: null
        }
      }
    }
  },
}