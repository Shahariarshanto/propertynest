// Mock chat conversations
// To connect real backend: replace with WebSocket/API in src/services/chatService.js
export const mockChats = [
  {
    id: 'c1',
    propertyId: 'p1',
    propertyTitle: 'Modern 2BR Apartment in Gulshan',
    participants: ['u2', 'u1'], // [renter, owner]
    messages: [
      {
        id: 'm1',
        senderId: 'u2',
        text: 'Hello! Is the Gulshan apartment still available?',
        timestamp: '2026-10-18T09:00:00Z',
        read: true,
      },
      {
        id: 'm2',
        senderId: 'u1',
        text: 'Yes, it is! Would you like to schedule a visit?',
        timestamp: '2026-10-18T09:15:00Z',
        read: true,
      },
      {
        id: 'm3',
        senderId: 'u2',
        text: 'That would be great. How about this Saturday at 11am?',
        timestamp: '2026-10-18T09:20:00Z',
        read: false,
      },
    ],
  },
  {
    id: 'c2',
    propertyId: 'p4',
    propertyTitle: 'Cozy Studio near Banani',
    participants: ['u5', 'u3'],
    messages: [
      {
        id: 'm4',
        senderId: 'u5',
        text: 'Is parking included in the rent?',
        timestamp: '2026-10-19T14:00:00Z',
        read: true,
      },
      {
        id: 'm5',
        senderId: 'u3',
        text: 'Yes, one covered parking spot is included.',
        timestamp: '2026-10-19T14:30:00Z',
        read: false,
      },
    ],
  },
];
