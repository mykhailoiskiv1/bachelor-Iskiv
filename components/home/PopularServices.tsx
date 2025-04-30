'use client';

import useSWR from 'swr';
import axios from 'axios';
import { Loader } from 'lucide-react';
import type { Service } from '@/types/service';


const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function PopularServices() {
  const { data: services, error } = useSWR<Service[]>('/api/services', fetcher);

  if (error) return <p className="text-center text-red-500">Failed to load services.</p>;
  if (!services) return <p className="text-center"><Loader className="animate-spin inline" /> Loading...</p>;

  return (
    <section className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Our Popular Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-gray-100 p-4 rounded-xl shadow hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 font-bold">{service.title}</span>
              {service.isHot && <span className="text-red-500 text-sm">🔥</span>}
            </div>
            <p className="text-sm text-gray-600">{service.category}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
