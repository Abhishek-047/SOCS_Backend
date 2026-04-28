const { StatusCodes } = require('http-status-codes');

const projectService = require('../services/projectService');
const pickRequestMeta = require('../utils/pickRequestMeta');

const listProjects = async (req, res) => {
  const result = await projectService.getProjects(req.validated.query);

  res.status(StatusCodes.OK).json({
    success: true,
    data: result
  });
};

const getProject = async (req, res) => {
  const project = await projectService.getProjectById(req.validated.params.id);

  res.status(StatusCodes.OK).json({
    success: true,
    data: project
  });
};

const createProject = async (req, res) => {
  const project = await projectService.createProject({
    payload: req.validated.body,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Project created successfully',
    data: project
  });
};

const updateProject = async (req, res) => {
  const project = await projectService.updateProject({
    projectId: req.validated.params.id,
    payload: req.validated.body,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Project updated successfully',
    data: project
  });
};

const deleteProject = async (req, res) => {
  const project = await projectService.deleteProject({
    projectId: req.validated.params.id,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Project deleted successfully',
    data: project
  });
};

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
