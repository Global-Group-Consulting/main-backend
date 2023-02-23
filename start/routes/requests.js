module.exports = function (Route) {
  Route.group(() => {
    Route.get('/', 'RequestController.readAll')
  
    Route.get('/count', 'RequestController.getCounters')
    Route.get('/statistics', 'RequestController.getStatistics')
    
    Route
      .post('/', 'RequestController.create')
      .validator('requests/create')
    
    Route.post('/admin', 'RequestController.createByAdmin')
      .validator('requests/createByAdmin')
    
    Route
      .post('/agent', 'RequestController.createByAgent')
      .validator('requests/createByAgent')
    
    Route
      .put('/:id', 'RequestController.update')
      .validator('requests/update')
    
    Route
      .get('/targetUser/:id', 'RequestController.readTargetUser')
    
    Route.get('/:id', 'RequestController.read')
    
    Route
      .delete('/:id', 'RequestController.delete')
      .validator('requests/delete')
    
    Route
      .put('/:id/approve', 'RequestController.approve')
      .validator('requests/approve')
    
    Route
      .put('/:id/reject', 'RequestController.reject')
      .validator('requests/reject')
    
    Route
      .put('/:id/cancel', 'RequestController.cancel')
      .validator('requests/reject')
  
    Route
      .post('/:id/attachments', 'RequestController.storeAttachments')
    
    Route
      .put('/:id/revert', 'RequestController.revert')
      .validator('requests/reject')
    
  }).prefix('/api/requests')
    .middleware('auth')
    .namespace('Api')
}
