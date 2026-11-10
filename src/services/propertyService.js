import { mockProperties } from '../data/mockProperties';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const propertyService = {
  async getAll() {
    await delay(300);
    return [...mockProperties];
  },

  async getById(id) {
    await delay(100);
    return mockProperties.find((p) => p.id === id) ?? null;
  },

  async create(data, ownerId) {
    await delay(200);
    const newProp = {
      ...data,
      id: `p_${Date.now()}`,
      ownerId,
      rating: 0,
      reviews: 0,
      available: true,
      featured: false,
      postedAt: new Date().toISOString().split('T')[0],
    };
    mockProperties.unshift(newProp);
    return newProp;
  },

  async update(id, data) {
    await delay(150);
    const idx = mockProperties.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Property not found');
    mockProperties[idx] = { ...mockProperties[idx], ...data };
    return mockProperties[idx];
  },

  async remove(id) {
    await delay(150);
    const idx = mockProperties.findIndex((p) => p.id === id);
    if (idx !== -1) mockProperties.splice(idx, 1);
  },
};
