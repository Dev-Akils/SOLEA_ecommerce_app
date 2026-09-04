"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STATUS_STYLES = {
    pending: "bg-gray-100 text-gray-700",
    paid: "bg-blue-100 text-blue-700",
    shipped: "bg-gold-500/20 text-maroon-950",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

export default function MyOrdersClient() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const res = await fetch("/api/orders");

            if (res.status === 401) {
                router.push("/login?next=/orders");
                return;
            }

            const data = await res.json();
            setOrders(data);
            setLoading(false);
        }
        load();
    }, [router]);

    

    return (
        <div>
            <div className="justify-between flex">
                <h1 className="text-2xl font-bold text-maroon-950 mb-8">My Orders</h1>
                <button
                    onClick={() => router.back()}
                    className="text-sm rounded-lg font-bold bg-maroon-950 mb-8 px-3 py-2 border border-white/60 text-white"
                >
                    Go Back
                </button>
            </div>


            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">Order</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Items</th>
                            <th className="p-3">Total</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td className="p-3" colSpan={5}>
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            orders.map((o) => (
                                <tr key={o._id} className="border-t align-top">
                                    <td className="p-3">
                                        <Link href={`/orders/${o._id}`} className="font-mono text-xs text-maroon-950 underline">
                                            {o._id}
                                        </Link>
                                    </td>
                                    <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">{o.items.length} item(s)</td>
                                    <td className="p-3">${o.totalPrice.toFixed(2)}</td>
                                    <td className="p-3">
                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${STATUS_STYLES[o.status] || "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {o.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                        {!loading && orders.length === 0 && (
                            <tr>
                                <td className="p-3 text-gray-500" colSpan={5}>
                                    No orders yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}