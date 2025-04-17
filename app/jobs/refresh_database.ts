import { BaseJob, ResqueFailure } from 'adonis-resque'
import { exec } from 'node:child_process'
import logger from '@adonisjs/core/services/logger'
import util from 'node:util'
import drive from '@adonisjs/drive/services/main'

const execAsync = util.promisify(exec)

export default class RefreshDatabase extends BaseJob {
  jobName = 'RefreshDatabase'
  queueName = 'database_refresh'

  cron = '0 1 * * *'

  async perform() {
    try {
      logger.info('Starting database refresh job...')
      const { stdout, stderr } = await execAsync('node ace migration:fresh')
      const disk = drive.use()
      await disk.deleteAll('/')
      if (stderr) {
        logger.error('Database refresh failed:')
        logger.error(stderr)
      } else {
        logger.info('Database refreshed successfully.')
        logger.info(stdout)
      }
    } catch (error) {
      logger.error('Error executing database refresh command:')
      logger.error(error.stderr || error)
    }
  }

  async onFailure(failure: ResqueFailure) {
    console.log('resque job failured:', failure)
  }
}
