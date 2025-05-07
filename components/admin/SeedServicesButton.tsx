'use client'

import { useState } from 'react'
import { PlusCircle } from 'lucide-react'

export default function SeedServicesButton() {
  const [loading, setLoading] = useState(false)

  const predefinedServices = [
    { title: 'Loft Conversion (Velux)', category: 'Loft & Extensions', icon: 'Layers', description: 'Install Velux-style loft windows and space.', isFeatured: true, isHot: true, sortOrder: 21 },
    { title: 'Dormer Loft Conversion', category: 'Loft & Extensions', icon: 'PanelBottom', description: 'Build a full-width dormer to extend living space.', isFeatured: true, isHot: true, sortOrder: 22 },
    { title: 'House Rear Extension', category: 'Loft & Extensions', icon: 'MoveRight', description: 'Add living area with rear-facing extension.', isFeatured: true, isHot: false, sortOrder: 23 },
    { title: 'Wrap-Around Extension', category: 'Loft & Extensions', icon: 'StretchHorizontal', description: 'Combine rear and side extensions.', isFeatured: false, isHot: true, sortOrder: 24 },
  
    { title: 'Garage Conversion', category: 'Garage & Garden', icon: 'Car', description: 'Turn garage into livable space or office.', isFeatured: true, isHot: false, sortOrder: 25 },
    { title: 'Garden Room Installation', category: 'Garage & Garden', icon: 'Trees', description: 'Build a modern garden studio or gym.', isFeatured: false, isHot: true, sortOrder: 26 },
    { title: 'Porch Extension', category: 'Garage & Garden', icon: 'DoorOpen', description: 'Extend your entrance with a stylish porch.', isFeatured: false, isHot: false, sortOrder: 27 },
  
    { title: 'Structural Steel Installation', category: 'Structural & Planning', icon: 'Construction', description: 'Fit RSJ beams for open-plan layouts.', isFeatured: true, isHot: false, sortOrder: 28 },
    { title: 'Planning Permission Service', category: 'Structural & Planning', icon: 'FileText', description: 'We handle all planning documents & drawings.', isFeatured: false, isHot: false, sortOrder: 29 },
    { title: 'Architectural Design Package', category: 'Structural & Planning', icon: 'PencilRuler', description: 'Detailed plans and 3D renders for your project.', isFeatured: true, isHot: true, sortOrder: 30 },
  
    { title: 'Underfloor Heating Installation', category: 'Interior Upgrades', icon: 'ThermometerSun', description: 'Install electric or wet underfloor heating.', isFeatured: true, isHot: true, sortOrder: 31 },
    { title: 'Skylight Installation', category: 'Interior Upgrades', icon: 'Sun', description: 'Brighten your room with new skylights.', isFeatured: false, isHot: false, sortOrder: 32 },
    { title: 'Sliding Glass Doors', category: 'Interior Upgrades', icon: 'PanelRightClose', description: 'Install stylish sliding doors to gardens or balconies.', isFeatured: true, isHot: false, sortOrder: 33 },
    { title: 'Wall Knockthrough Service', category: 'Interior Upgrades', icon: 'SplitSquareHorizontal', description: 'Open up space by removing non-load bearing walls.', isFeatured: false, isHot: true, sortOrder: 34 },
    { title: 'Smart Home Wiring', category: 'Interior Upgrades', icon: 'Wifi', description: 'Install cables and control hubs for smart devices.', isFeatured: false, isHot: false, sortOrder: 35 },
  ]
  

  const seedServices = async () => {
    setLoading(true)
    try {
      for (const service of predefinedServices) {
        await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(service),
        })
      }
      alert('✅ Services seeded successfully!')
    } catch (error) {
      console.error('Seeding error:', error)
      alert('❌ Failed to seed services.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={seedServices}
      disabled={loading}
      className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-opacity-90 text-white px-4 py-2 rounded-full text-sm shadow transition"
    >
      <PlusCircle size={18} />
      {loading ? 'Seeding...' : 'Seed 20 Services'}
    </button>
  )
}
