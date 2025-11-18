"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
    errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
    children: React.ReactNode
    fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
        this.setState({
            error,
            errorInfo
        })

        // In a real app, you would log this to an error reporting service
        // Example: logErrorToService(error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    }

    handleReload = () => {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback
                return <FallbackComponent error={this.state.error!} resetError={this.handleReset} />
            }

            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <AlertTriangle className="h-12 w-12 text-red-500" />
                            </div>
                            <CardTitle className="text-red-600">Something went wrong</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center text-gray-600">
                                <p className="mb-2">We're sorry, but something unexpected happened.</p>
                                <p className="text-sm">The error has been logged and we'll look into it.</p>
                            </div>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="bg-red-50 p-3 rounded-md">
                                    <p className="text-sm font-medium text-red-800 mb-1">Error Details:</p>
                                    <p className="text-xs text-red-700 font-mono break-all">
                                        {this.state.error.message}
                                    </p>
                                    {this.state.error.stack && (
                                        <details className="mt-2">
                                            <summary className="text-xs text-red-700 cursor-pointer">Stack Trace</summary>
                                            <pre className="text-xs text-red-700 mt-1 whitespace-pre-wrap overflow-auto max-h-32">
                                                {this.state.error.stack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button onClick={this.handleReset} className="flex-1">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Try Again
                                </Button>
                                <Button variant="outline" onClick={this.handleReload} className="flex-1">
                                    <Home className="h-4 w-4 mr-2" />
                                    Reload Page
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        return this.props.children
    }
}

// Hook for handling async errors in functional components
export const useErrorHandler = () => {
    const [error, setError] = React.useState<Error | null>(null)

    const resetError = React.useCallback(() => {
        setError(null)
    }, [])

    const captureError = React.useCallback((error: Error) => {
        console.error('Async error caught:', error)
        setError(error)
    }, [])

    // Throw error to be caught by ErrorBoundary
    React.useEffect(() => {
        if (error) {
            throw error
        }
    }, [error])

    return { captureError, resetError }
}

// Utility function for wrapping async operations
export const handleAsyncError = <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    onError?: (error: Error) => void
) => {
    return async (...args: T): Promise<R | undefined> => {
        try {
            return await fn(...args)
        } catch (error) {
            const errorObj = error instanceof Error ? error : new Error(String(error))
            console.error('Async operation failed:', errorObj)
            onError?.(errorObj)
            return undefined
        }
    }
}