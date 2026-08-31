export interface Movie {
  id: string;
  title: string;
  rating: number;
  imageUrl: string;
  categories: string[];
  isSpotlight?: boolean;
}

export interface Network {
  id: string;
  name: string;
  colorClass: string;
}

export interface Category {
  id: string;
  name: string;
  isSpecial?: boolean;
}
