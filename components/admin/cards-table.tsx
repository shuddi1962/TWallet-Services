"use client";

import { useState } from "react";
import { CreditCard, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CardProduct {
  id: string;
  name: string;
  type: string;
  price?: number;
  status?: string;
  created_at: string;
}

export function AdminCardsTable({ products }: { products: CardProduct[] }) {
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm max-w-sm mb-4">
        <Search className="w-4 h-4 text-body" />
        <input
          type="text"
          placeholder="Search cards..."
          className="bg-transparent border-none outline-none w-full text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search card products"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <CreditCard className="w-12 h-12 text-body mx-auto mb-3" />
          <p className="text-body">No card products yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-body bg-surface-50 border-b border-surface-200">
                  <th scope="col" className="py-3 px-4 font-medium">Name</th>
                  <th scope="col" className="py-3 px-4 font-medium">Type</th>
                  <th scope="col" className="py-3 px-4 font-medium">Price</th>
                  <th scope="col" className="py-3 px-4 font-medium">Status</th>
                  <th scope="col" className="py-3 px-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-heading">{product.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {product.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-body">{product.price ? `${product.price} USDC` : "—"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.status !== "active" ? "bg-surface-200 text-body" : "bg-success/10 text-success"
                      }`}>
                        {product.status ?? "active"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-body text-xs">
                      {formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
