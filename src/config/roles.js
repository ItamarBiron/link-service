const allRoles = {
  user: ['manageLinks'],
  admin: ['getUsers', 'manageUsers', 'manageLinks'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
