/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const PagesController = () => import('#controllers/pages_controller')
const FilesController = () => import('#controllers/files_controller')
const PermissionsController = () => import('#controllers/permissions_controller')

import transmit from '@adonisjs/transmit/services/main'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const RolesController = () => import('#controllers/roles_controller')
const UsersController = () => import('#controllers/users_controller')

transmit.registerRoutes()

/* GET Routes */

router.on('/').renderInertia('home')
router.get('/login', [PagesController, 'login']).as('login')
router.post('/login', [AuthController, 'login'])
router.get('/logout', async ({ auth, response }) => {
  await auth.use('web').logout()
  return response.redirect().toRoute('login')
})
router.get('/users', [PagesController, 'users']).use(middleware.auth())
router.get('/settings', [PagesController, 'settings']).use(middleware.auth())
router.put('/dashboard/:folder?', [FilesController, 'update']).use(middleware.fileMax())

/* Logged Routes */

const usersRoutes = router
  .group(() => {
    router.put('', [UsersController, 'manageUser'])
    router.delete('', [UsersController, 'deleteUser'])
    router.post('', [UsersController, 'manageUser'])
  })
  .prefix('/user')

const rolesRoutes = router
  .group(() => {
    router.post('', [RolesController, 'createRole'])
    router.delete('', [RolesController, 'deleteRole'])
    router.put('', [RolesController, 'updateRole'])
  })
  .prefix('/role')

const folderPermissionsRoutes = router
  .group(() => {
    router.post('', [PermissionsController, 'create'])
    router.delete('', [PermissionsController, 'delete'])
  })
  .prefix('/folder-permissions')

const folderRoutes = router
  .group(() => {
    router.delete('', [FilesController, 'delete'])
    router.post('', [FilesController, 'findFolder'])
  })
  .prefix('/folder')

/* Wrap Logged Routes */

router
  .group(() => {
    usersRoutes
    rolesRoutes
    folderPermissionsRoutes
    folderRoutes
    router.post('/upload/:folder?', [FilesController, 'create'])
    router.get('/dashboard/:folder?', [PagesController, 'dashboard']).as('dashboard')
  })
  .use(middleware.auth())
