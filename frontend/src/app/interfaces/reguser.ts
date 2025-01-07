// Define the structure for the language
interface Language {
  language: string;
}

// Define the structure for an address
interface Address {
  street: string;
  city: string;
  state: string;
}

// Define the main user interface
export interface RegUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  type: 'user' | 'admin'; // Enum representing user type
    addresses: Address[]; // Each user can have multiple addresses
  languages: Language[]; // Each address can have multiple languages
  profilePicture?: string; // URL to the user's profile picture
}
