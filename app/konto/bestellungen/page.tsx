'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import { useEffect, useState } from 'react';
import { sdk } from '@/lib/medusa';

interface Order {
  id: string;
  display_id: number;
  created_at: string;
  total: number;
  status: string;
  items: { title: string; quantity: number }[];
}

export default function BestellungenPage() {
  const { customer, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !customer) return;

    async function loadOrders() {
      setIsLoading(true);
      try {
        const response = await sdk.store.order.list();
        if (response.orders) {
          setOrders(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            response.orders.map((o: any) => ({
              id: o.id,
              display_id: o.display_id,
              created_at: o.created_at,
              total: o.total,
              status: o.status,
              items: (o.items ?? []).map((i: { title: string; quantity: number }) => ({
                title: i.title,
                quantity: i.quantity,
              })),
            }))
          );
        }
      } catch {
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [customer, authLoading]);

  if (authLoading || !customer) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatPrice = (amount: number) => {
    return amount.toFixed(2).replace('.', ',') + ' €';
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link
          href="/konto"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zurück zum Konto
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Meine Bestellungen
        </h1>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Bestellungen werden geladen...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Noch keine Bestellungen
            </h2>
            <p className="text-slate-600 mb-6">
              Sie haben noch keine Bestellungen aufgegeben.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Zum Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Bestellung #{order.display_id}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-600">
                      {formatPrice(order.total)}
                    </p>
                    <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  {order.items.map((item, idx) => (
                    <p key={idx}>
                      {item.quantity}x {item.title}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
