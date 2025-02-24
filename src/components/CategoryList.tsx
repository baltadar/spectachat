import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Glasses, Frame, Pen as Lens, Building2, Store } from 'lucide-react';

const categories = [
  { id: 'prescription', name: 'Prescription', icon: Eye },
  { id: 'non-prescription', name: 'Non-Prescription', icon: Glasses },
  { id: 'frames', name: 'Frames', icon: Frame },
  { id: 'lenses', name: 'Lenses', icon: Lens },
  { id: 'brands', name: 'Brands', icon: Building2 },
  { id: 'providers', name: 'Providers', icon: Store },
];

export function CategoryList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <Icon className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">Browse {category.name.toLowerCase()} questions</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}