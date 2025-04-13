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
const UsersController = () => import('#controllers/users_controller')

router.on('/').renderInertia('home')
router.get('/login', [PagesController, 'login']).as('login')
router.post('/login', [AuthController, 'login'])
router.get('/dashboard', [PagesController, 'dashboard']).as('dashboard').use(middleware.auth())
router.get('/logout', async ({ auth, response }) => {
  await auth.use('web').logout()
  return response.redirect().toRoute('login')
})
router.get('/users', [PagesController, 'users']).use(middleware.auth())
router.post('/user', [UsersController, 'create'])
