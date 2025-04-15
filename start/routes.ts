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
const SettingsController = () => import('#controllers/settings_controller')

import transmit from '@adonisjs/transmit/services/main'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

transmit.registerRoutes()

router.on('/').renderInertia('home')
router.get('/login', [PagesController, 'login']).as('login')
router.post('/login', [AuthController, 'login'])

router
  .get('/dashboard/:folder?', [PagesController, 'dashboard'])
  .as('dashboard')
  .use(middleware.auth())
router.post('/upload/:folder?', [FilesController, 'create'])

router.get('/logout', async ({ auth, response }) => {
  await auth.use('web').logout()
  return response.redirect().toRoute('login')
})

router.get('/users', [PagesController, 'users']).use(middleware.auth())
router.post('/user', [SettingsController, 'createUser'])
router.post('/role', [SettingsController, 'createRole'])
router.delete('/role', [SettingsController, 'deleteRole'])
router.delete('/user', [SettingsController, 'deleteUser'])
router.put('/dashboard/:folder?', [FilesController, 'update'])
router.get('/settings', [PagesController, 'settings']).use(middleware.auth())
router.post('/folder-permissions', [PermissionsController, 'create'])
router.delete('/folder-permissions', [PermissionsController, 'delete'])
router.post('/folder', [FilesController, 'findFolder'])
router.put('/role', [SettingsController, 'updateRole'])
