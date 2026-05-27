export type ServiceType =
  | 'boarding'
  | 'sitting'
  | 'walking'
  | 'daycare'
  | 'grooming'
  | 'training'
  | 'vet'
  | 'taxi';

export type ProviderTypeExtended = ServiceType | 'pension' | 'visiting' | 'insurance' | 'other';

export type DogSize = 'tiny' | 'small' | 'medium' | 'large' | 'giant';

export interface ServiceInfo {
  id: ServiceType;
  label: string;
  icon: string;
  description: string;
  priceLabel: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  dogName: string;
  rating: number;
  text: string;
  date: string;
  service: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar: string;
  city: string;
  neighborhood: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  services: ServiceType[];
  verified: boolean;
  responseTime: string;
  repeatCustomers: number;
  yearsExperience: number;
  bio: string;
  images: string[];
  dogSizes: DogSize[];
  homeEnvironment: string[];
  reviews: Review[];
  available: boolean;
  whatsapp: string;
  featured: boolean;
  distance?: string;
}
