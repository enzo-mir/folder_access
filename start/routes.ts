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
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const SettingsController = () => import('#controllers/settings_controller')

router.on('/').renderInertia('home')
router.get('/login', [PagesController, 'login']).as('login')
router.post('/login', [AuthController, 'login'])
router.get('/dashboard', [PagesController, 'dashboard']).as('dashboard').use(middleware.auth())
router.get('/logout', async ({ auth, response }) => {
  await auth.use('web').logout()
  return response.redirect().toRoute('login')
})
router.get('/users', [PagesController, 'users'])
router.post('/user', [SettingsController, 'createUser'])
router.post('/role', [SettingsController, 'createRole'])
router.delete('/role', [SettingsController, 'deleteRole'])
router.delete('/user', [SettingsController, 'deleteUser'])
