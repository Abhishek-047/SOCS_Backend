const { StatusCodes } = require('http-status-codes');

const contactService = require('../services/contactService');
const pickRequestMeta = require('../utils/pickRequestMeta');

const submitContact = async (req, res) => {
  const contact = await contactService.submitContact({
    payload: req.validated.body,
    requestMeta: pickRequestMeta(req)
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Contact request submitted successfully',
    data: contact
  });
};

module.exports = {
  submitContact
};
