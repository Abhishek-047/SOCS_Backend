const AUDIT_ACTIONS = require('../constants/auditActions');
const contactRepository = require('../repositories/contactRepository');
const auditLogService = require('./auditLogService');

const submitContact = async ({ payload, requestMeta }) => {
  const contact = await contactRepository.create(payload);

  await auditLogService.log({
    action: AUDIT_ACTIONS.CONTACT_SUBMITTED,
    ...requestMeta
  });

  return contact;
};

module.exports = {
  submitContact
};
