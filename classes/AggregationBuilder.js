const util = require('lucid-mongo/lib/util')
const { preparePaginatedResult } = require('../app/Utilities/Pagination')

/**
 * @typedef {import('lucid-mongo/src/Database')} DbConnection
 * @typedef {import('/@types/HttpRequest').RequestPagination} RequestPagination
 * @typedef {import('/@types/pagination/PaginatedResult').PaginatedResult} PaginatedResult
 */

class AggregationBuilder {
  _pipeline = []
  _pagination = []
  _sort = null
  _filter = {}
  
  /**
   * @type {DbConnection}
   */
  connection
  
  /**
   * @type {string}
   */
  collection
  
  constructor (connection, collection) {
    if (!connection) {
      throw new Error('Missing connection')
    }
    
    if (!collection) {
      throw new Error('Missing collection')
    }
    
    this.connection = connection
    this.collection = collection
  }
  
  $match (filter) {
    Object.assign(this._filter, filter)
    this._pipeline.push({ $match: filter })
    
    return this
  }
  
  $lookup (collection, localField, foreignField = '_id', as = null, project = null) {
    const fieldName = as || util.makeEmbedName(collection)
    
    const lookupPipeline = [{ $match: { $expr: { $eq: ['$' + foreignField, '$$localField'] } } }]
    
    if (project) {
      lookupPipeline.push({ $project: project })
    }
    
    this._pipeline.push({
      $lookup: {
        from: collection,
        let: { localField: '$' + localField },
        pipeline: lookupPipeline,
        as: fieldName
      }
    })
    
    return this
  }
  
  $lookupOne (collection, localField, foreignField = '_id', as = null, project = null) {
    const fieldName = as || util.makeEmbedName(collection)
    
    this.$lookup(collection, localField, foreignField, fieldName, project)
    
    this._pipeline.push({
      $unwind: {
        path: '$' + fieldName,
        preserveNullAndEmptyArrays: true
      }
    })
    
    return this
  }
  
  $unwind (field, preserveNull = true) {
    this._pipeline.push({
      $unwind: {
        path: '$' + field,
        preserveNullAndEmptyArrays: preserveNull
      }
    })
    
    return this
  }
  
  $$pushRaw (pipeline) {
    this._pipeline.push(...pipeline)
    
    return this
  }
  
  $project (project) {
    if (project && Object.keys(project).length) {
      this._pipeline.push({ $project: project })
    }
    
    return this
  }
  
  $sort (sort) {
    if (sort && Object.keys(sort).length) {
      this._sort = sort
      this._pipeline.push({ $sort: sort })
    }
    
    return this
  }
  
  $pagination (page, limit) {
    this._pagination = []
    
    this._pagination.push({ $skip: (page - 1) * limit })
    this._pagination.push({ $limit: limit })
  }
  
  /**
   * Execute the aggregation pipeline and return the result as an array.
   *
   * @param {any[]} [extraPipeline]
   * @return {Promise<any[] | null>}
   */
  async execute (_pipeline = null) {
    const pipeline = _pipeline || [...this._pipeline, ...this._pagination]
    
    console.log('pipeline', JSON.stringify(pipeline))
    
    const aggregation = await this.connection.collection(this.collection).aggregate(pipeline)
    
    return aggregation.get()
  }
  
  /**
   * Execute the aggregation pipeline and return the count of the result.
   *
   * @return {Promise<number>}
   */
  async count () {
    // const matchFields = JSON.stringify(this._pipeline.filter(pipeline => pipeline.$match))
    
    const pipeline = [...this._pipeline, { $count: 'count' }]/*.filter(pipeline => {
      // const isLookup = !!pipeline.$lookup
      
      if (isLookup) {
        if (!matchFields.includes(pipeline.$lookup.as)) {
          return false
        }
      }
      
      return !pipeline.$sort && !pipeline.$skip && !pipeline.$limit && !pipeline.$project && !pipeline.$unwind
    })*/
    
    const data = await this.execute(pipeline)
    
    return data && data.length ? data[0].count : 0
  }
  
  /**
   * Execute the aggregation pipeline and return the result as a paginated object.
   *
   * @param {RequestPagination} requestPagination
   * @return {Promise<PaginatedResult>}
   */
  async paginate (requestPagination) {
    // Store pagination info
    this.$pagination(requestPagination.page, requestPagination.limit)
    
    const timerStart = new Date()
    
    const timerDataStart = new Date()
    const data = await this.execute()
    const timerDataEnd = new Date()
    
    const timerCountStart = new Date()
    const total = await this.count()
    const timerCountEnd = new Date()
    
    const timerEnd = new Date()
    
    const timerData = timerDataEnd.getTime() - timerDataStart.getTime()
    const timerCount = timerCountEnd.getTime() - timerCountStart.getTime()
    const timerTotal = timerEnd.getTime() - timerStart.getTime()
    
    console.log('timerData: ' + timerData + 'ms', 'timerCount: ' + timerCount + 'ms', 'totalTile: ' + timerTotal)
    
    const result = util.makePaginateMeta(total, requestPagination.page, requestPagination.limit)
    result.data = data
    // time in ms for the query
    result.time = timerTotal
    
    return preparePaginatedResult(result, this._sort, this._filter)
  }
  
  /**
   * Set the raw pipeline for the aggregation.
   *
   * @param pipeline
   * @return {AggregationBuilder}
   */
  setRawPipeline (pipeline) {
    // Reset the pipeline
    this._pipeline = pipeline
    
    // Reset other properties
    this._pagination = []
    this._filter = {}
    this._sort = null
    
    return this
  }
}

module.exports.AggregationBuilder = AggregationBuilder

/*

[
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      pipeline: [
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            contractNumber: 1,
            referenceAgent: 1,
          },
        },
      ],
      as: "user",
    },
  },
  {
    $unwind: {
      path: "$user",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "user.referenceAgent",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $match: {
      type: 3,
    },
  },
  {
    $sort: {
      updated_at: 1,
    },
  },
  {
    $count: "count",
  },
]

 */
