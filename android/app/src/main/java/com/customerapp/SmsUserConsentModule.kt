package com.customerapp

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Status

/**
 * SMS User Consent API Native Module for React Native 0.76+
 * Compatible with TurboModules (New Architecture)
 * 
 * This module uses the SMS User Consent API which:
 * - Works with ANY SMS provider (no app hash required)
 * - Shows system dialog asking user permission
 * - Automatically extracts OTP when user approves
 */
class SmsUserConsentModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    companion object {
        const val MODULE_NAME = "SmsUserConsent"
        const val SMS_CONSENT_REQUEST = 1001
        const val EVENT_SMS_RECEIVED = "SmsUserConsentReceived"
    }

    private var smsReceiver: BroadcastReceiver? = null
    private var isListening = false

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String = MODULE_NAME

    /**
     * Start listening for SMS User Consent
     * When SMS arrives, system will show permission dialog
     */
    @ReactMethod
    fun startSmsConsent(promise: Promise) {
        try {
            val activity = currentActivity ?: run {
                promise.reject("NO_ACTIVITY", "Current activity is null")
                return
            }

            if (isListening) {
                promise.reject("ALREADY_LISTENING", "SMS consent is already active")
                return
            }

            // Start SMS User Consent
            SmsRetriever.getClient(activity).startSmsUserConsent(null)
                .addOnSuccessListener {
                    isListening = true
                    registerSmsReceiver(activity)
                    promise.resolve(true)
                }
                .addOnFailureListener { e ->
                    promise.reject("START_FAILED", e.message)
                }
        } catch (e: Exception) {
            promise.reject("EXCEPTION", e.message)
        }
    }

    /**
     * Stop listening for SMS
     */
    @ReactMethod
    fun stopSmsConsent(promise: Promise) {
        try {
            unregisterSmsReceiver()
            isListening = false
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("EXCEPTION", e.message)
        }
    }

    /**
     * Check if currently listening for SMS
     */
    @ReactMethod
    fun isListening(promise: Promise) {
        promise.resolve(isListening)
    }

    private fun registerSmsReceiver(activity: Activity) {
        smsReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                if (SmsRetriever.SMS_RETRIEVED_ACTION == intent.action) {
                    val extras = intent.extras
                    val status = extras?.get(SmsRetriever.EXTRA_STATUS) as? Status

                    when (status?.statusCode) {
                        CommonStatusCodes.SUCCESS -> {
                            // SMS retrieved, need user consent
                            val consentIntent = extras.getParcelable<Intent>(SmsRetriever.EXTRA_CONSENT_INTENT)
                            try {
                                activity.startActivityForResult(consentIntent, SMS_CONSENT_REQUEST)
                            } catch (e: Exception) {
                                sendEventToJS("error", e.message ?: "Failed to start consent activity")
                            }
                        }
                        CommonStatusCodes.TIMEOUT -> {
                            sendEventToJS("timeout", "SMS retrieval timed out")
                            isListening = false
                        }
                        else -> {
                            sendEventToJS("error", "SMS retrieval failed")
                            isListening = false
                        }
                    }
                }
            }
        }

        val intentFilter = IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION)
        
        // For Android 13+ (API 33+), use RECEIVER_EXPORTED flag
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.registerReceiver(
                activity,
                smsReceiver,
                intentFilter,
                ContextCompat.RECEIVER_EXPORTED
            )
        } else {
            activity.registerReceiver(smsReceiver, intentFilter)
        }
    }

    private fun unregisterSmsReceiver() {
        try {
            smsReceiver?.let {
                currentActivity?.unregisterReceiver(it)
                smsReceiver = null
            }
        } catch (e: Exception) {
            // Ignore unregister errors
        }
    }

    /**
     * Handle activity result from SMS consent dialog
     */
    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == SMS_CONSENT_REQUEST) {
            isListening = false
            
            when (resultCode) {
                Activity.RESULT_OK -> {
                    // User approved, get SMS message
                    val message = data?.getStringExtra(SmsRetriever.EXTRA_SMS_MESSAGE)
                    if (message != null) {
                        sendEventToJS("success", message)
                    } else {
                        sendEventToJS("error", "No SMS message received")
                    }
                }
                Activity.RESULT_CANCELED -> {
                    // User denied
                    sendEventToJS("denied", "User denied SMS access")
                }
                else -> {
                    sendEventToJS("error", "Unknown result: $resultCode")
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent?) {
        // Not used
    }

    private fun sendEventToJS(status: String, message: String) {
        val params = Arguments.createMap().apply {
            putString("status", status)
            putString("message", message)
        }
        
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit(EVENT_SMS_RECEIVED, params)
    }

    override fun invalidate() {
        super.invalidate()
        unregisterSmsReceiver()
        reactApplicationContext.removeActivityEventListener(this)
    }
}
