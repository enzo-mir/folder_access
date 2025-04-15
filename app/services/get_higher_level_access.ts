import Role from '#models/role'

export const getHigherLevelAccess = async () => {
  const HighestRole = await Role.query().select('*').orderBy('level', 'desc').first()
  return HighestRole
}

export const getAllRoles = async () => {
  const roles = await Role.query().select('*').orderBy('level')
  return roles
}
