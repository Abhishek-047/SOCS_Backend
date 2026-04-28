const { StatusCodes } = require('http-status-codes');
const teamService = require('../services/teamService');
const pickRequestMeta = require('../utils/pickRequestMeta');

const listTeamMembers = async (req, res) => {
  const result = await teamService.getTeamMembers(req.validated.query || {});
  res.status(StatusCodes.OK).json({ success: true, data: result });
};

const getTeamMember = async (req, res) => {
  const member = await teamService.getTeamMemberById(req.validated.params.id);
  res.status(StatusCodes.OK).json({ success: true, data: member });
};

const createTeamMember = async (req, res) => {
  const member = await teamService.createTeamMember({
    payload: req.validated.body,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });
  res.status(StatusCodes.CREATED).json({ success: true, message: 'Team member created', data: member });
};

const updateTeamMember = async (req, res) => {
  const member = await teamService.updateTeamMember({
    memberId: req.validated.params.id,
    payload: req.validated.body,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });
  res.status(StatusCodes.OK).json({ success: true, message: 'Team member updated', data: member });
};

const deleteTeamMember = async (req, res) => {
  const member = await teamService.deleteTeamMember({
    memberId: req.validated.params.id,
    adminUser: req.user,
    requestMeta: pickRequestMeta(req)
  });
  res.status(StatusCodes.OK).json({ success: true, message: 'Team member deleted', data: member });
};

module.exports = { listTeamMembers, getTeamMember, createTeamMember, updateTeamMember, deleteTeamMember };
