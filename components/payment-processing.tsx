"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    CreditCard,
    Banknote,
    QrCode,
    Smartphone,
    Wallet,
    CheckCircle,
    AlertCircle,
    Receipt,
    ArrowLeft,
    Calculator
} from "lucide-react"
import { PaymentMethod, Order } from "@/types"
import { usePOS } from "@/context/POSContext"
import { toast } from "sonner"

interface PaymentProcessingProps {
    order?: Order
    onPaymentComplete: (paymentMethod: PaymentMethod) => void
    onCancel?: () => void
}

type PaymentType = "cash" | "card" | "digital" | "qr"

interface PaymentState {
    type: PaymentType
    amount: number
    receivedAmount: number
    change: number
    cardDetails?: {
        cardNumber: string
        expiryDate: string
        cvv: string
        cardholderName: string
    }
    digitalWallet?: {
        provider: string
        reference: string
    }
    processing: boolean
    completed: boolean
}

export function PaymentProcessing({ order, onPaymentComplete, onCancel }: PaymentProcessingProps) {
    const { state, getCartTotal } = usePOS()
    const { subtotal, tax, total } = order ?
        { subtotal: order.subtotal, tax: order.tax, total: order.total } :
        getCartTotal()

    const [paymentState, setPaymentState] = useState<PaymentState>({
        type: "cash",
        amount: total,
        receivedAmount: 0,
        change: 0,
        processing: false,
        completed: false
    })

    const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>("cash")
    const [cashReceived, setCashReceived] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [expiryDate, setExpiryDate] = useState("")
    const [cvv, setCvv] = useState("")
    const [cardholderName, setCardholderName] = useState("")
    const [digitalProvider, setDigitalProvider] = useState("")

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: state.settings.currency
        }).format(amount)
    }

    const calculateChange = (received: number) => {
        return Math.max(0, received - total)
    }

    const handleCashPayment = async () => {
        const received = parseFloat(cashReceived)
        if (isNaN(received) || received < total) {
            toast.error("Insufficient amount received")
            return
        }

        setPaymentState({ ...paymentState, processing: true })

        try {
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            const change = calculateChange(received)
            const paymentMethod: PaymentMethod = {
                type: "cash",
                details: {
                    amountReceived: received,
                    change: change
                }
            }

            setPaymentState({
                ...paymentState,
                receivedAmount: received,
                change,
                processing: false,
                completed: true
            })

            setTimeout(() => {
                onPaymentComplete(paymentMethod)
                toast.success(`Payment completed! Change: ${formatCurrency(change)}`)
            }, 500)

        } catch (error) {
            setPaymentState({ ...paymentState, processing: false })
            toast.error("Payment processing failed")
        }
    }

    const handleCardPayment = async () => {
        if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
            toast.error("Please fill all card details")
            return
        }

        setPaymentState({ ...paymentState, processing: true })

        try {
            // Simulate card processing
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Simulate random success/failure for demo
            const success = Math.random() > 0.1 // 90% success rate

            if (success) {
                const paymentMethod: PaymentMethod = {
                    type: "card",
                    details: {
                        last4: cardNumber.slice(-4),
                        cardholderName,
                        transactionId: `TXN-${Date.now()}`,
                        authCode: Math.random().toString(36).substr(2, 6).toUpperCase()
                    }
                }

                setPaymentState({
                    ...paymentState,
                    processing: false,
                    completed: true,
                    cardDetails: {
                        cardNumber,
                        expiryDate,
                        cvv,
                        cardholderName
                    }
                })

                setTimeout(() => {
                    onPaymentComplete(paymentMethod)
                    toast.success("Card payment successful!")
                }, 500)

            } else {
                throw new Error("Card declined")
            }

        } catch (error) {
            setPaymentState({ ...paymentState, processing: false })
            toast.error("Card payment failed. Please try again.")
        }
    }

    const handleDigitalPayment = async () => {
        if (!digitalProvider) {
            toast.error("Please select a digital wallet")
            return
        }

        setPaymentState({ ...paymentState, processing: true })

        try {
            // Simulate digital wallet processing
            await new Promise(resolve => setTimeout(resolve, 1500))

            const paymentMethod: PaymentMethod = {
                type: "digital",
                details: {
                    provider: digitalProvider,
                    transactionId: `DIG-${Date.now()}`,
                    reference: Math.random().toString(36).substr(2, 10).toUpperCase()
                }
            }

            setPaymentState({
                ...paymentState,
                processing: false,
                completed: true,
                digitalWallet: {
                    provider: digitalProvider,
                    reference: paymentMethod.details?.reference || 'N/A'
                }
            })

            setTimeout(() => {
                onPaymentComplete(paymentMethod)
                toast.success(`Payment completed via ${digitalProvider}!`)
            }, 500)

        } catch (error) {
            setPaymentState({ ...paymentState, processing: false })
            toast.error("Digital payment failed")
        }
    }

    const handleQRPayment = async () => {
        setPaymentState({ ...paymentState, processing: true })

        try {
            // Simulate QR code payment processing
            await new Promise(resolve => setTimeout(resolve, 3000))

            const paymentMethod: PaymentMethod = {
                type: "qr",
                details: {
                    qrCode: `QR-${Date.now()}`,
                    transactionId: `QR-${Date.now()}`,
                    amount: total
                }
            }

            setPaymentState({
                ...paymentState,
                processing: false,
                completed: true
            })

            setTimeout(() => {
                onPaymentComplete(paymentMethod)
                toast.success("QR payment completed!")
            }, 500)

        } catch (error) {
            setPaymentState({ ...paymentState, processing: false })
            toast.error("QR payment failed")
        }
    }

    const quickCashAmounts = [
        total,
        Math.ceil(total / 5) * 5, // Round up to nearest 5
        Math.ceil(total / 10) * 10, // Round up to nearest 10
        Math.ceil(total / 20) * 20, // Round up to nearest 20
    ].filter((amount, index, arr) => arr.indexOf(amount) === index) // Remove duplicates

    if (paymentState.completed) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-green-600">Payment Successful!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold">{formatCurrency(total)}</p>
                        <p className="text-gray-600">Payment completed</p>
                    </div>

                    {paymentState.type === "cash" && paymentState.change > 0 && (
                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-600">Change to return:</p>
                            <p className="text-xl font-bold text-yellow-600">
                                {formatCurrency(paymentState.change)}
                            </p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => window.location.reload()}>
                            New Order
                        </Button>
                        <Button variant="outline" className="flex-1">
                            <Receipt className="h-4 w-4 mr-2" />
                            Print Receipt
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Order Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax ({(state.settings.taxRate * 100).toFixed(1)}%):</span>
                            <span>{formatCurrency(tax)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Select Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button
                            variant={selectedPaymentType === "cash" ? "default" : "outline"}
                            className="h-20 flex-col"
                            onClick={() => setSelectedPaymentType("cash")}
                        >
                            <Banknote className="h-6 w-6 mb-2" />
                            Cash
                        </Button>
                        <Button
                            variant={selectedPaymentType === "card" ? "default" : "outline"}
                            className="h-20 flex-col"
                            onClick={() => setSelectedPaymentType("card")}
                        >
                            <CreditCard className="h-6 w-6 mb-2" />
                            Card
                        </Button>
                        <Button
                            variant={selectedPaymentType === "digital" ? "default" : "outline"}
                            className="h-20 flex-col"
                            onClick={() => setSelectedPaymentType("digital")}
                        >
                            <Smartphone className="h-6 w-6 mb-2" />
                            Digital Wallet
                        </Button>
                        <Button
                            variant={selectedPaymentType === "qr" ? "default" : "outline"}
                            className="h-20 flex-col"
                            onClick={() => setSelectedPaymentType("qr")}
                        >
                            <QrCode className="h-6 w-6 mb-2" />
                            QR Code
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {selectedPaymentType === "cash" && <Banknote className="h-5 w-5" />}
                        {selectedPaymentType === "card" && <CreditCard className="h-5 w-5" />}
                        {selectedPaymentType === "digital" && <Smartphone className="h-5 w-5" />}
                        {selectedPaymentType === "qr" && <QrCode className="h-5 w-5" />}
                        {selectedPaymentType.charAt(0).toUpperCase() + selectedPaymentType.slice(1)} Payment
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {selectedPaymentType === "cash" && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="cash-received">Amount Received</Label>
                                <Input
                                    id="cash-received"
                                    type="number"
                                    step="0.01"
                                    min={total}
                                    value={cashReceived}
                                    onChange={(e) => setCashReceived(e.target.value)}
                                    placeholder={formatCurrency(total)}
                                    className="text-lg font-mono"
                                />
                            </div>

                            {/* Quick Cash Buttons */}
                            <div>
                                <Label>Quick Amount</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                    {quickCashAmounts.map(amount => (
                                        <Button
                                            key={amount}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCashReceived(amount.toString())}
                                        >
                                            {formatCurrency(amount)}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {cashReceived && parseFloat(cashReceived) >= total && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span>Change:</span>
                                        <span className="font-bold text-green-600">
                                            {formatCurrency(calculateChange(parseFloat(cashReceived)))}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <Button
                                className="w-full"
                                onClick={handleCashPayment}
                                disabled={!cashReceived || parseFloat(cashReceived) < total || paymentState.processing}
                            >
                                {paymentState.processing ? "Processing..." : "Complete Cash Payment"}
                            </Button>
                        </div>
                    )}

                    {selectedPaymentType === "card" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <Input
                                        id="card-number"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={16}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input
                                        id="expiry"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="cvv">CVV</Label>
                                    <Input
                                        id="cvv"
                                        type="password"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        placeholder="123"
                                        maxLength={4}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="cardholder">Cardholder Name</Label>
                                    <Input
                                        id="cardholder"
                                        value={cardholderName}
                                        onChange={(e) => setCardholderName(e.target.value)}
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <Button
                                className="w-full"
                                onClick={handleCardPayment}
                                disabled={!cardNumber || !expiryDate || !cvv || !cardholderName || paymentState.processing}
                            >
                                {paymentState.processing ? "Processing Payment..." : `Charge ${formatCurrency(total)}`}
                            </Button>
                        </div>
                    )}

                    {selectedPaymentType === "digital" && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="digital-provider">Select Digital Wallet</Label>
                                <Select value={digitalProvider} onValueChange={setDigitalProvider}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose digital wallet" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="apple-pay">Apple Pay</SelectItem>
                                        <SelectItem value="google-pay">Google Pay</SelectItem>
                                        <SelectItem value="samsung-pay">Samsung Pay</SelectItem>
                                        <SelectItem value="paypal">PayPal</SelectItem>
                                        <SelectItem value="venmo">Venmo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <Wallet className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                                <p className="text-sm text-gray-600">
                                    Customer will complete payment using their {digitalProvider || 'selected'} digital wallet
                                </p>
                            </div>

                            <Button
                                className="w-full"
                                onClick={handleDigitalPayment}
                                disabled={!digitalProvider || paymentState.processing}
                            >
                                {paymentState.processing ? "Waiting for confirmation..." : `Pay ${formatCurrency(total)} with ${digitalProvider}`}
                            </Button>
                        </div>
                    )}

                    {selectedPaymentType === "qr" && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-8 rounded-lg text-center">
                                <QrCode className="h-24 w-24 mx-auto mb-4 text-gray-400" />
                                <p className="text-sm text-gray-600 mb-2">
                                    Customer scans QR code to pay
                                </p>
                                <p className="font-bold text-lg">{formatCurrency(total)}</p>
                            </div>

                            <Button
                                className="w-full"
                                onClick={handleQRPayment}
                                disabled={paymentState.processing}
                            >
                                {paymentState.processing ? "Waiting for payment..." : "Generate QR Code & Process Payment"}
                            </Button>
                        </div>
                    )}

                    {paymentState.processing && (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Processing payment...</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
                {onCancel && (
                    <Button variant="outline" onClick={onCancel} className="flex-1">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                )}
            </div>
        </div>
    )
}