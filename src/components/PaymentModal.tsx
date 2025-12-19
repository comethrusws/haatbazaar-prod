'use client';

import { useState } from "react";
import { FaSpinner, FaCheckCircle, FaWallet, FaMobileAlt } from "react-icons/fa";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    amount: number;
};

export default function PaymentModal({ isOpen, onClose, onSuccess, amount }: Props) {
    const [step, setStep] = useState<'LOGIN' | 'CONFIRM' | 'PROCESSING' | 'SUCCESS'>('LOGIN');
    const [phone, setPhone] = useState('');
    const [mpin, setMpin] = useState('');

    if (!isOpen) return null;

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('PROCESSING');
        setTimeout(() => {
            setStep('CONFIRM');
        }, 1500);
    };

    const handleConfirm = () => {
        setStep('PROCESSING');
        setTimeout(() => {
            setStep('SUCCESS');
            setTimeout(() => {
                onSuccess();
            }, 1000);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden relative">
                {/* Header */}
                <div className="bg-[#5C2D91] p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <FaWallet className="text-xl" />
                        <span className="font-bold text-lg">IME Khalti Pay</span>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white">&times;</button>
                </div>

                <div className="p-6">
                    {step === 'LOGIN' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="text-center mb-6">
                                <p className="text-gray-500 text-sm">Amount to Pay</p>
                                <p className="text-3xl font-bold text-[#5C2D91]">NPR {amount.toLocaleString()}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Mobile Number</label>
                                <div className="flex items-center border rounded px-3 py-2 focus-within:ring-2 ring-[#5C2D91]">
                                    <FaMobileAlt className="text-gray-400 mr-2" />
                                    <input
                                        type="tel"
                                        className="w-full outline-none"
                                        placeholder="98XXXXXXXX"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">MPIN</label>
                                <input
                                    type="password"
                                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 ring-[#5C2D91] text-center tracking-widest"
                                    placeholder="••••"
                                    maxLength={4}
                                    value={mpin}
                                    onChange={e => setMpin(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#5C2D91] text-white py-3 rounded-lg font-bold hover:bg-[#4a2475] transition"
                            >
                                Login
                            </button>
                        </form>
                    )}

                    {step === 'CONFIRM' && (
                        <div className="text-center space-y-6">
                            <div>
                                <h3 className="font-bold text-gray-700">Confirm Payment</h3>
                                <p className="text-sm text-gray-500">Please verify the details below</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Merchant</span>
                                    <span className="font-bold">Haatbazaar</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Mobile</span>
                                    <span className="font-bold">{phone}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between">
                                    <span className="text-gray-500">Total Amount</span>
                                    <span className="font-bold text-[#5C2D91]">NPR {amount.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setStep('LOGIN')} className="flex-1 border border-gray-300 py-2 rounded text-gray-600 font-bold">Cancel</button>
                                <button onClick={handleConfirm} className="flex-1 bg-[#5C2D91] text-white py-2 rounded font-bold">Pay Now</button>
                            </div>
                        </div>
                    )}

                    {step === 'PROCESSING' && (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <FaSpinner className="animate-spin text-4xl text-[#5C2D91]" />
                            <p className="text-gray-500 font-medium">Processing Transaction...</p>
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <FaCheckCircle className="text-5xl text-green-500 animate-bounce" />
                            <h3 className="text-xl font-bold text-gray-800">Payment Successful!</h3>
                            <p className="text-gray-500">Redirecting...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
