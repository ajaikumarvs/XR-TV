package com.anonymous.XRTV

import android.content.Context
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class NsdModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var nsdManager: NsdManager? = null
    private var discoveryListener: NsdManager.DiscoveryListener? = null
    private val resolveListeners = mutableMapOf<String, NsdManager.ResolveListener>()

    override fun getName(): String {
        return "NsdModule"
    }

    @ReactMethod
    fun startDiscovery(serviceType: String, promise: Promise) {
        try {
            if (nsdManager == null) {
                nsdManager = reactApplicationContext.getSystemService(Context.NSD_SERVICE) as NsdManager
            }

            discoveryListener = object : NsdManager.DiscoveryListener {
                override fun onDiscoveryStarted(regType: String) {
                    sendEvent("onDiscoveryStarted", Arguments.createMap().apply {
                        putString("serviceType", regType)
                    })
                }

                override fun onServiceFound(service: NsdServiceInfo) {
                    sendEvent("onServiceFound", Arguments.createMap().apply {
                        putString("serviceName", service.serviceName)
                        putString("serviceType", service.serviceType)
                    })
                    
                    // Auto-resolve the service
                    resolveService(service)
                }

                override fun onServiceLost(service: NsdServiceInfo) {
                    sendEvent("onServiceLost", Arguments.createMap().apply {
                        putString("serviceName", service.serviceName)
                        putString("serviceType", service.serviceType)
                    })
                }

                override fun onDiscoveryStopped(serviceType: String) {
                    sendEvent("onDiscoveryStopped", Arguments.createMap().apply {
                        putString("serviceType", serviceType)
                    })
                }

                override fun onStartDiscoveryFailed(serviceType: String, errorCode: Int) {
                    sendEvent("onStartDiscoveryFailed", Arguments.createMap().apply {
                        putString("serviceType", serviceType)
                        putInt("errorCode", errorCode)
                    })
                }

                override fun onStopDiscoveryFailed(serviceType: String, errorCode: Int) {
                    sendEvent("onStopDiscoveryFailed", Arguments.createMap().apply {
                        putString("serviceType", serviceType)
                        putInt("errorCode", errorCode)
                    })
                }
            }

            nsdManager?.discoverServices(serviceType, NsdManager.PROTOCOL_DNS_SD, discoveryListener)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("DISCOVERY_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun stopDiscovery(promise: Promise) {
        try {
            discoveryListener?.let {
                nsdManager?.stopServiceDiscovery(it)
                discoveryListener = null
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("STOP_DISCOVERY_ERROR", e.message, e)
        }
    }

    private fun resolveService(service: NsdServiceInfo) {
        val resolveListener = object : NsdManager.ResolveListener {
            override fun onResolveFailed(serviceInfo: NsdServiceInfo, errorCode: Int) {
                sendEvent("onResolveFailed", Arguments.createMap().apply {
                    putString("serviceName", serviceInfo.serviceName)
                    putInt("errorCode", errorCode)
                })
            }

            override fun onServiceResolved(serviceInfo: NsdServiceInfo) {
                val host = serviceInfo.host?.hostAddress ?: ""
                val port = serviceInfo.port
                
                sendEvent("onServiceResolved", Arguments.createMap().apply {
                    putString("serviceName", serviceInfo.serviceName)
                    putString("serviceType", serviceInfo.serviceType)
                    putString("host", host)
                    putInt("port", port)
                })
                
                // Remove this listener after use
                resolveListeners.remove(serviceInfo.serviceName)
            }
        }

        try {
            resolveListeners[service.serviceName] = resolveListener
            nsdManager?.resolveService(service, resolveListener)
        } catch (e: Exception) {
            // If resolve fails, just log it
            android.util.Log.e("NsdModule", "Failed to resolve service: ${e.message}")
        }
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RN built-in Event Emitter Calls
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN built-in Event Emitter Calls
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        try {
            discoveryListener?.let {
                nsdManager?.stopServiceDiscovery(it)
            }
        } catch (e: Exception) {
            // Ignore
        }
    }
}
