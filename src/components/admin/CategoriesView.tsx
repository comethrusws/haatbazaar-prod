'use client';

import { useState } from "react";
import { createCategory, deleteCategory } from "@/actions/admin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function CategoriesView({ categories }: { categories: any[] }) {
    const [showForm, setShowForm] = useState(false);

    async function handleAdd(formData: FormData) {
        const data = {
            label: formData.get('label') as string,
            key: formData.get('key') as string,
            icon: formData.get('icon') as string,
        };
        await createCategory(data);
        setShowForm(false);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Product Categories</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    {showForm ? 'Cancel' : 'Add Category'}
                </button>
            </div>

            {showForm && (
                <form action={handleAdd} className="bg-white p-6 rounded-xl shadow-md border mb-8 flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Label</label>
                        <input name="label" placeholder="e.g. Smart Phones" required className="mt-1 block w-full border border-gray-300 rounded p-2" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Key (slug)</label>
                        <input name="key" placeholder="e.g. smart-phones" required className="mt-1 block w-full border border-gray-300 rounded p-2" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Icon Name</label>
                        <input name="icon" placeholder="faMobile" className="mt-1 block w-full border border-gray-300 rounded p-2" />
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded h-[42px]">Save</button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center text-blue-600">
                                {/* Icon rendering is tricky without map, just showing initial */}
                                {cat.label[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{cat.label}</h3>
                                <p className="text-xs text-gray-400">{cat.key}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { if (confirm('Delete category?')) deleteCategory(cat.id) }}
                            className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
