import { ObjectId } from 'mongodb'
import buildMongoOrders from 'utils/mongoOrder'

export default {
  LifeEvent: {
    id: async (parent) => parent.id || parent._id
  },
  Query: {
    allLifeEvents: async (_, args, { mongo }) => {
      const { first, skip, orderBy } = args

      const limit = first || 10
      const offset = skip || 0
      const obj = mongo.LifeEvent.find({})

      if (first !== undefined) obj.limit(limit)
      if (skip !== undefined) obj.skip(offset)

      if (orderBy) obj.sort(buildMongoOrders(orderBy))
      else obj.sort({ _id: -1 }) // -1 = DESC

      return await obj.toArray()
    },
    getLifeEvent: async (_, args, { mongo }) => {
      const lifeEvent = args.id ? await mongo.LifeEvent.findOne({ _id: ObjectId(args.id) }) : null

      return lifeEvent
    },
  },

  Mutation: {
    createLifeEvent: async (_, args, context) => {
      const { mongo } = context

      const { insertedId } = await mongo.LifeEvent.insertOne(args)
      const createdLifeEvent = await mongo.LifeEvent.findOne({ _id: insertedId })

      return {
        success: true,
        lifeEvent: createdLifeEvent
      }
    },
    updateLifeEvent: async (_, args, context) => {
      const { mongo } = context

      await mongo.LifeEvent.updateOne({ _id: ObjectId(args.id)},{
        "$set":{
          date:args.date,
          content:args.content
        }
      })
      const createdLifeEvent = await mongo.LifeEvent.findOne({ _id: ObjectId(args.id) })

      return {
        success: true,
        lifeEvent: createdLifeEvent
      }
    },
    deleteLifeEvent: async (_, args, context) => {
      const { mongo } = context

      const createdLifeEvent = await mongo.LifeEvent.findOne({ _id: ObjectId(args.id) })
      if(createdLifeEvent!== undefined){
        await mongo.LifeEvent.deleteOne({ _id: ObjectId(args.id)})
        return {
          success: true,
          lifeEvent: createdLifeEvent
        }
      }else{
        return {
          success: true,
          lifeEvent: null
        }
      }

      
      

      
    }
  },
}