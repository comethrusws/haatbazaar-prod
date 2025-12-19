'use client';

import { useState } from "react";
import UploadArea from "@/components/UploadArea";
import SubmitButton from "@/components/SubmitButton";
import { createMallProduct, updateMallProductStock } from "@/actions/admin"; // We might need a full update action too later
// For now, let's assume create only or basic update.
import { categories } from "@/libs/helpers"; // Fallback
// We will pass dynamic categories as props

type Props = {
    dbCategories?: { key: string; label: string }[];
    onSuccess?: () => void;
};

export default function MallProductForm({ dbCategories = [], onSuccess }: Props) {
    const [files, setFiles] = useState<string[]>([]);

    const availableCategories = dbCategories.length > 0 ? dbCategories : categories;

    async function handleSubmit(formData: FormData) {
        const data = {
            title: formData.get('title') as string,
            price: parseFloat(formData.get('price') as string),
            category: formData.get('category') as string,
            description: formData.get('description') as string,
            stock: parseInt(formData.get('stock') as string),
            condition: formData.get('condition') as string,
            images: JSON.parse(formData.get('files') as string),
        };

        await createMallProduct(data);
        if (onSuccess) onSuccess();
        // Reset form or close modal logic would be handled by parent or here
        // simpler to just reload or let parent handle
    }

    return (
        <form action={async (formData) => {
            formData.set('files', JSON.stringify(files));
            await handleSubmit(formData);
        }} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input name="title" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price (NPR)</label>
                    <input name="price" type="number" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                        {availableCategories.map(c => (
                            <option key={c.key} value={c.key}>{c.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input name="stock" type="number" defaultValue="1" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Condition</label>
                <select name="condition" className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                    <option value="NEW">Brand New</option>
                    <option value="REFURBISHED">Refurbished</option>
                    <option value="USED">Used - Good</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" rows={4} className="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                <UploadArea files={files} setFiles={setFiles} />
            </div>

            <div className="pt-4">
                <SubmitButton>Add Product</SubmitButton>
            </div>
        </form>
    );
}
