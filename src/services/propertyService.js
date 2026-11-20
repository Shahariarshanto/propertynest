import { mockProperties } from '../data/mockProperties';

// High-performance property service - zero artificial delays for minimal loading latency
export const propertyService = {
  async getAll() {
    return [...mockProperties];
  },

  async getById(id) {
    return mockProperties.find((p) => p.id === id) ?? null;
  },

  async create(data, ownerId) {
    const newProp = {
      ...data,
      id: `p_${Date.now()}`,
      ownerId,
      available: true,
      featured: false,
      postedAt: new Date().toISOString().split('T')[0],
    };
    mockProperties.unshift(newProp);
    return newProp;
  },

  async update(id, data) {
    const idx = mockProperties.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Property not found');
    mockProperties[idx] = { ...mockProperties[idx], ...data };
    return mockProperties[idx];
  },

  async remove(id) {
    const idx = mockProperties.findIndex((p) => p.id === id);
    if (idx !== -1) mockProperties.splice(idx, 1);
  },
};
