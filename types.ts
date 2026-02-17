
export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  semester: string;
  bio?: string;
  profilePicture?: string;
  isVerified?: boolean;
  badges?: string[];
  stats?: {
    resourcesShared: number;
    downloads: number;
    reputation: number;
  };
}

export enum ResourceType {
  NOTES = 'Notes',
  QUESTION_PAPERS = 'Question Papers',
  SOLUTIONS = 'Solutions',
  PROJECT_REPORTS = 'Project Reports',
  STUDY_MATERIAL = 'Study Material'
}

export enum Privacy {
  PUBLIC = 'Public',
  PRIVATE = 'Private'
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  subject: string;
  semester: string;
  college: string;
  uploaderId: string;
  uploaderName: string;
  type: ResourceType;
  year: string;
  tags: string[];
  description: string;
  privacy: Privacy;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  averageRating: number;
  reviews: Review[];
  uploadDate: string;
  downloads: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LeaderboardEntry {
  college: string;
  uploads: number;
  rank: number;
}
