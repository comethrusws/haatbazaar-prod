'use client';

import { useState } from "react";
import MallProductForm from "./MallProductForm";
import { formatMoney } from "@/libs/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteMallProduct } from "@/actions/admin";

export default function InventoryView({ products, categories }: { products: any[], categories: any[] }) {
    const [showForm, setShowForm] = useState(false);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mall Inventory</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    {showForm ? 'Cancel' : 'Add Product'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-md border mb-8 animate-fade-in">
                    <h3 className="text-lg font-bold mb-4">Add New Product</h3>
                    <MallProductForm dbCategories={categories} onSuccess={() => setShowForm(false)} />
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm">
                            <th className="p-4 border-b">Product</th>
                            <th className="p-4 border-b">Category</th>
                            <th className="p-4 border-b">Price</th>
                            <th className="p-4 border-b">Stock</th>
                            <th className="p-4 border-b">Condition</th>
                            <th className="p-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">No products in inventory.</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 group">
                                    <td className="p-4 border-b">
                                        <div className="font-medium text-gray-900">{product.title}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.id}</div>
                                    </td>
                                    <td className="p-4 border-b capitalize">{product.category}</td>
                                    <td className="p-4 border-b font-medium">{formatMoney(product.price)}</td>
                                    <td className="p-4 border-b">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="p-4 border-b text-sm text-gray-600">{product.condition}</td>
                                    <td className="p-4 border-b">
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                            {/* Edit would go here */}
                                            <button
                                                onClick={() => { if (confirm('Delete this product?')) deleteMallProduct(product.id) }}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
