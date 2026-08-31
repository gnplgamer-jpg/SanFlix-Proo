import { Movie, Network, Category } from './types';

export const categories: Category[] = [
  { id: '1', name: 'Animation' },
  { id: '2', name: 'Crime' },
  { id: '3', name: 'Old is gold' },
  { id: '4', name: '🔥 18+ Hub', isSpecial: true },
  { id: '6', name: 'Porn Hub', isSpecial: true },
  { id: '5', name: 'Action' },
];

export const networks: Network[] = [
  { id: 'n1', name: 'NETFLIX', colorClass: 'bg-red-600' },
  { id: 'n2', name: 'PRIME VIDEO', colorClass: 'bg-sky-500' },
  { id: 'n3', name: 'ALTBALAJI', colorClass: 'bg-orange-500' },
  { id: 'n4', name: 'SONYLIV', colorClass: 'bg-indigo-700' },
];

export const movies: Movie[] = [
  {
    id: 'm1',
    title: 'The Great Indian Server',
    rating: 9.2,
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=800',
    categories: ['Drama', 'Spotlight'],
    isSpotlight: true,
  },
  {
    id: 'm2',
    title: 'KD - The Devil (Hindi)',
    rating: 8.5,
    imageUrl: 'https://images.unsplash.com/photo-1620020473216-1f74ea79eb11?auto=format&fit=crop&q=80&w=400',
    categories: ['South Indian', 'Action', 'Crime'],
  },
  {
    id: 'm3',
    title: 'Leo',
    rating: 8.9,
    imageUrl: 'https://images.unsplash.com/photo-1574267432553-4b462808152a?auto=format&fit=crop&q=80&w=400',
    categories: ['South Indian', 'Action'],
  },
  {
    id: 'm4',
    title: 'Jailer',
    rating: 8.1,
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400',
    categories: ['South Indian', 'Action', 'Crime'],
  },
  {
    id: 'm5',
    title: 'Neon Genesis',
    rating: 9.5,
    imageUrl: 'https://images.unsplash.com/photo-1580477667995-15120f1ce8b7?auto=format&fit=crop&q=80&w=400',
    categories: ['Animation', 'Sci-Fi'],
  },
  {
    id: 'm6',
    title: 'Mumbai Underworld',
    rating: 7.8,
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=400',
    categories: ['Crime', 'Thriller'],
  },
  {
    id: 'm7',
    title: 'Vintage Classics',
    rating: 8.4,
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400',
    categories: ['Old is gold', 'Drama'],
  },
  {
    id: 'm8',
    title: 'Dark Desire',
    rating: 6.9,
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=400',
    categories: ['18+ Hub', 'Thriller'],
  }
];
