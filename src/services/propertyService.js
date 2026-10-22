import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockProperties } from '../data/mockProperties';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const mapFromDB = (row) => ({
  id: row.id,
  ownerId: row.owner_id,
  title: row.title,
  type: row.type,
  status: row.status,
  price: Number(row.price),
  location: row.location,
  area: Number(row.area),
  beds: Number(row.beds),
  baths: Number(row.baths),
  floor: Number(row.floor),
  furnishing: row.furnishing,
  amenities: row.amenities || [],
  images: row.images || [],
  description: row.description,
  rating: Number(row.rating || 0),
  reviews: Number(row.reviews || 0),
  available: row.available ?? true,
  featured: row.featured ?? false,
  postedAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
});

export const propertyService = {
  async getAll() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase getAll properties error:', error);
        return [...mockProperties];
      }

      if (data && data.length > 0) {
        return data.map(mapFromDB);
      }
      return [...mockProperties];
    }

    await delay(300);
    return [...mockProperties];
  },

  async getById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) return mapFromDB(data);
    }

    await delay(150);
    return mockProperties.find((p) => p.id === id) ?? null;
  },

  async create(data, ownerId) {
    if (isSupabaseConfigured) {
      try {
        const { data: inserted, error } = await supabase
          .from('properties')
          .insert([
            {
              owner_id: ownerId?.startsWith('u') ? null : ownerId,
              title: data.title,
              type: data.type,
              status: data.status,
              price: data.price,
              location: data.location,
              area: data.area,
              beds: data.beds,
              baths: data.baths,
              floor: data.floor,
              furnishing: data.furnishing,
              amenities: data.amenities,
              images: data.images,
              description: data.description,
              available: true,
              featured: false,
            },
          ])
          .select()
          .single();

        if (!error && inserted) {
          return mapFromDB(inserted);
        }
      } catch (err) {
        console.warn('Supabase create error, saving in-memory:', err.message);
      }
    }

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
    if (isSupabaseConfigured) {
      try {
        const dbUpdates = { ...data };
        delete dbUpdates.id;
        delete dbUpdates.ownerId;
        delete dbUpdates.postedAt;

        const { data: updated, error } = await supabase
          .from('properties')
          .update(dbUpdates)
          .eq('id', id)
          .select()
          .single();

        if (!error && updated) {
          return mapFromDB(updated);
        }
      } catch (err) {
        console.warn('Supabase update error, updating in-memory:', err.message);
      }
    }

    await delay(150);
    const idx = mockProperties.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Property not found');
    mockProperties[idx] = { ...mockProperties[idx], ...data };
    return mockProperties[idx];
  },

    await delay(200);
    const idx = mockProperties.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Property not found');
    mockProperties[idx] = { ...mockProperties[idx], ...data };
    return mockProperties[idx];
  },

  async remove(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    await delay(150);
    const idx = mockProperties.findIndex((p) => p.id === id);
    if (idx !== -1) mockProperties.splice(idx, 1);
  },
};
