'use client';

import { withdrawFunds } from "@/app/actions/orderActions";
import { useState } from "react";
import { FaWallet } from "react-icons/fa";

type Props = {
    balance: number;
    accountNumber?: string | null;
};

export default function EarningsCard({ balance, accountNumber }: Props) {
    const [loading, setLoading] = useState(false);
    const [currentBalance, setCurrentBalance] = useState(balance);

    const handleWithdraw = async () => {
        if (!confirm("Are you sure you want to withdraw NRs. " + currentBalance + "?")) return;

        setLoading(true);
        try {
            await withdrawFunds();
            alert("Withdrawal successful! Check your email.");
            setCurrentBalance(0);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-lg mb-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-medium opacity-90 mb-1">
                        <FaWallet /> My Earnings
                    </h2>
                    <p className="text-4xl font-bold">NPR {currentBalance.toLocaleString()}</p>
                    <p className="text-sm opacity-75 mt-2">
                        {accountNumber ? `Linked: ${accountNumber}` : 'No account linked (Mock)'}
                    </p>
                </div>

                <button
                    onClick={handleWithdraw}
                    disabled={currentBalance <= 0 || loading}
                    className="bg-white text-blue-700 px-6 py-2 rounded-full font-bold shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {loading ? 'Processing...' : 'Withdraw Funds'}
                </button>
            </div>
        </div>
    );
}
