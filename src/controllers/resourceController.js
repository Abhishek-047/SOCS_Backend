const { StatusCodes } = require('http-status-codes');
const resourceService = require('../services/resourceService');
const pickRequestMeta = require('../utils/pickRequestMeta');

const listResources = async (req, res) => {
  const result = await resourceService.getResources(req.validated.query || {});
  res.status(StatusCodes.OK).json({ success: true, data: result });
};

const getResource = async (req, res) => {
  const resource = await resourceService.getResourceById(req.validated.params.id);
  res.status(StatusCodes.OK).json({ success: true, data: resource });
};

const createResource = async (req, res) => {
  const resource = await resourceService.createResource({
    payload: req.validated.body,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });
  res.status(StatusCodes.CREATED).json({ success: true, message: 'Resource created', data: resource });
};

const updateResource = async (req, res) => {
  const resource = await resourceService.updateResource({
    resourceId: req.validated.params.id,
    payload: req.validated.body,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });
  res.status(StatusCodes.OK).json({ success: true, message: 'Resource updated', data: resource });
};

const deleteResource = async (req, res) => {
  const resource = await resourceService.deleteResource({
    resourceId: req.validated.params.id,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });
  res.status(StatusCodes.OK).json({ success: true, message: 'Resource deleted', data: resource });
};

module.exports = { listResources, getResource, createResource, updateResource, deleteResource };
