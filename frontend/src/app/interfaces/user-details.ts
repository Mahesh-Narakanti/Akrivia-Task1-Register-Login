// Define the structure for the language
interface Language {
  id: number;
  language: string;
  city: string;
}

// Define the structure for an address
interface Address {
  id: number;
  user_id: number;
  street: string;
  city: string;
  state: string;
  languages: Language[]; // Each address can have multiple languages
}

// Define the main user interface
export interface UserDetails {
  id: string;
  username: string;
  email: string;
  password: string;
  type: 'user' | 'admin'; // Enum representing user type
  addresses: Address[]; // Each user can have multiple addresses
  profilePicture?: string; // URL to the user's profile picture
}
