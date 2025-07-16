"use client"

import { Clock, Globe, Phone, X } from "lucide-react"
import { useState } from "react"


export default function RemoteServiceNotification () {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div className="relative z-10 w-full bg-yellow-100 border-1-3 border-yellow-400 p-3 mb-4 rounded-r-lg shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800">
                            Important!
                        </span>
                    </div>
                    <div className="text-sm text-yellow-800">
                        <span className="font-medium">
                            You can join us in our services during this time with this info:
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 ml-4 text-yellow-600 hover:text-yellow-800 transition-colors"
                    aria-label="close notification"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-2 text-xs text-yellow-700 space-y-1">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">Service Times:</span>
                        <span>Sundays 11 AM & Wednesdays 7 PM</span>
                    </div>

                    <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span className="font-medium">Dial-in:</span>
                        <a href="tel:+12678079601" className="underline hover:text-yellow-900">
                            (267) 807-9601
                        </a>
                    </div>

                    <div className="flex items-center space-x-1">
                        <span className="font-medium">Access Code:</span>
                        <span className="font-medium">796680#</span>
                    </div>

                    <div className="flex items-center space-x-1">
                        <Globe className="h-3 w-3" />
                        <span className="font-medium">Online Meeting:</span>
                        <a 
                        href="https://join.freeconferencecall.com/796680"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-yellow-900">
                            Join Online Meeting
                        </a>
                    </div>
                </div>

                <div className="mt-2 pt-2 border-t border-yellow-300">
                    <p className="text-xs">
                        <a 
                            href="https://fccdl.in/i/796680"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-yellow-900"
                        >
                            International dial-in numbers available
                        </a>
                    </p>
                    <p className="text-xs mt-1">
                        For additional assistance connecting to the service text &apos;Call Me&apos; to the Dial-in number above and you will be called into the conference. Message and data rates may apply.
                    </p>
                </div>
            </div>
        </div>
    )
}