import { useCallback, useEffect, useState } from 'react'
import { NativeEventEmitter, NativeModules, Platform } from 'react-native'

const { NsdModule } = NativeModules

export interface DiscoveredDevice {
  serviceName: string
  serviceType: string
  host: string
  port: number
}

export const useNsdDiscovery = (serviceType: string = '_androidtvremote2._tcp') => {
  const [devices, setDevices] = useState<DiscoveredDevice[]>([])
  const [isDiscovering, setIsDiscovering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startDiscovery = useCallback(async () => {
    if (Platform.OS !== 'android' || !NsdModule) {
      setError('NSD is only available on Android')
      return
    }

    try {
      setIsDiscovering(true)
      setError(null)
      setDevices([])
      await NsdModule.startDiscovery(serviceType)
    } catch (err: any) {
      setError(err.message || 'Failed to start discovery')
      setIsDiscovering(false)
    }
  }, [serviceType])

  const stopDiscovery = useCallback(async () => {
    if (Platform.OS !== 'android' || !NsdModule) {
      return
    }

    try {
      await NsdModule.stopDiscovery()
      setIsDiscovering(false)
    } catch (err: any) {
      console.error('Failed to stop discovery:', err)
    }
  }, [])

  useEffect(() => {
    if (Platform.OS !== 'android' || !NsdModule) {
      return
    }

    const eventEmitter = new NativeEventEmitter(NsdModule)

    const onDiscoveryStarted = eventEmitter.addListener('onDiscoveryStarted', (event) => {
      console.log('Discovery started:', event)
      setIsDiscovering(true)
    })

    const onServiceFound = eventEmitter.addListener('onServiceFound', (event) => {
      console.log('Service found:', event)
    })

    const onServiceResolved = eventEmitter.addListener('onServiceResolved', (event) => {
      console.log('Service resolved:', event)
      setDevices((prev) => {
        // Check if device already exists
        const exists = prev.some((d) => d.host === event.host && d.port === event.port)
        if (exists) {
          return prev
        }
        return [...prev, {
          serviceName: event.serviceName,
          serviceType: event.serviceType,
          host: event.host,
          port: event.port,
        }]
      })
    })

    const onServiceLost = eventEmitter.addListener('onServiceLost', (event) => {
      console.log('Service lost:', event)
      setDevices((prev) => prev.filter((d) => d.serviceName !== event.serviceName))
    })

    const onDiscoveryStopped = eventEmitter.addListener('onDiscoveryStopped', (event) => {
      console.log('Discovery stopped:', event)
      setIsDiscovering(false)
    })

    const onStartDiscoveryFailed = eventEmitter.addListener('onStartDiscoveryFailed', (event) => {
      console.error('Discovery failed:', event)
      setError(`Discovery failed with error code: ${event.errorCode}`)
      setIsDiscovering(false)
    })

    const onResolveFailed = eventEmitter.addListener('onResolveFailed', (event) => {
      console.error('Resolve failed:', event)
    })

    return () => {
      onDiscoveryStarted.remove()
      onServiceFound.remove()
      onServiceResolved.remove()
      onServiceLost.remove()
      onDiscoveryStopped.remove()
      onStartDiscoveryFailed.remove()
      onResolveFailed.remove()
      
      // Stop discovery when component unmounts
      stopDiscovery()
    }
  }, [stopDiscovery])

  return {
    devices,
    isDiscovering,
    error,
    startDiscovery,
    stopDiscovery,
  }
}
