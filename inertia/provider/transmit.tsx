import { Transmit } from '@adonisjs/transmit-client'

let transmit: Transmit | null = null

if (typeof window !== 'undefined') {
  transmit = new Transmit({
    baseUrl: window.location.origin,
  })
}

export const transmitFolder = async () => {
  if (!transmit) {
    return {
      onMessage: (_: (msg: any) => void) => () => {},
      close: () => {},
    }
  }

  const subscription = transmit.subscription('folders')
  await subscription.create()

  return subscription
}
