
import { Resource, User, ResourceType, Privacy, LeaderboardEntry, Review } from '../types';

// Mock Data
const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Advanced Data Structures Notes',
    subject: 'Computer Science',
    semester: '5th',
    college: 'MIT Academy',
    uploaderId: 'u1',
    uploaderName: 'Alice Johnson',
    type: ResourceType.NOTES,
    year: '2023',
    tags: ['DSA', 'B-Trees', 'Graphs'],
    description: 'Detailed handwritten notes covering advanced data structure concepts.',
    privacy: Privacy.PUBLIC,
    fileUrl: '#',
    fileName: 'dsa_notes.pdf',
    fileSize: '4.2 MB',
    averageRating: 4.8,
    reviews: [
      { id: 'r1', userId: 'u2', userName: 'Bob', rating: 5, comment: 'Life saver!', createdAt: '2024-01-10' }
    ],
    uploadDate: '2024-01-05',
    downloads: 124
  },
  {
    id: '2',
    title: 'Thermodynamics Previous Year Papers',
    subject: 'Mechanical Engineering',
    semester: '3rd',
    college: 'Stanbridge Univ',
    uploaderId: 'u3',
    uploaderName: 'Charlie Smith',
    type: ResourceType.QUESTION_PAPERS,
    year: '2022',
    tags: ['Physics', 'Exams', 'Mech'],
    description: 'A collection of question papers from the last 5 years.',
    privacy: Privacy.PUBLIC,
    fileUrl: '#',
    fileName: 'thermo_papers.pdf',
    fileSize: '1.8 MB',
    averageRating: 4.2,
    reviews: [],
    uploadDate: '2023-12-20',
    downloads: 89
  },
  {
    id: '3',
    title: 'AI Ethics Project Report',
    subject: 'Artificial Intelligence',
    semester: '7th',
    college: 'MIT Academy',
    uploaderId: 'u1',
    uploaderName: 'Alice Johnson',
    type: ResourceType.PROJECT_REPORTS,
    year: '2024',
    tags: ['AI', 'Ethics', 'Research'],
    description: 'Comprehensive report on social implications of AI models.',
    privacy: Privacy.PRIVATE,
    fileUrl: '#',
    fileName: 'ai_ethics.docx',
    fileSize: '2.5 MB',
    averageRating: 4.5,
    reviews: [],
    uploadDate: '2024-02-15',
    downloads: 12
  }
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Auth
  login: async (email: string): Promise<User> => {
    await sleep(1000);
    // In real app: POST /auth/login
    return {
      id: 'u1',
      name: 'Alice Johnson',
      email: email,
      college: 'MIT Academy',
      branch: 'Computer Science',
      semester: '5th',
      bio: 'Loves teaching and sharing knowledge.',
      profilePicture: 'https://picsum.photos/seed/alice/200'
    };
  },

  register: async (userData: any): Promise<User> => {
    await sleep(1200);
    // In real app: POST /auth/register
    return { ...userData, id: Math.random().toString(36).substr(2, 9) };
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    await sleep(800);
    // In real app: PUT /users/profile
    return { id: 'u1', ...userData } as User;
  },

  // Resources
  fetchResources: async (filters?: any): Promise<Resource[]> => {
    await sleep(1500);
    // In real app: GET /resources?search=...&semester=...
    let filtered = [...MOCK_RESOURCES];
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(r => r.title.toLowerCase().includes(s) || r.subject.toLowerCase().includes(s));
    }
    if (filters?.semester && filters.semester !== 'All') {
      filtered = filtered.filter(r => r.semester === filters.semester);
    }
    return filtered;
  },

  fetchResourceById: async (id: string): Promise<Resource | undefined> => {
    await sleep(500);
    return MOCK_RESOURCES.find(r => r.id === id);
  },

  uploadResource: async (formData: any): Promise<Resource> => {
    await sleep(2000);
    // In real app: POST /resources (multipart/form-data)
    const newResource: Resource = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      uploaderId: 'u1',
      uploaderName: 'Alice Johnson',
      college: 'MIT Academy',
      averageRating: 0,
      reviews: [],
      uploadDate: new Date().toISOString().split('T')[0],
      downloads: 0,
      fileSize: '0.5 MB' // mock
    };
    return newResource;
  },

  deleteResource: async (id: string): Promise<void> => {
    await sleep(800);
    // In real app: DELETE /resources/:id
  },

  submitReview: async (resourceId: string, review: Partial<Review>): Promise<Review> => {
    await sleep(600);
    // In real app: POST /resources/:id/reviews
    return {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'u1',
      userName: 'Alice Johnson',
      rating: review.rating || 5,
      comment: review.comment || '',
      createdAt: new Date().toISOString().split('T')[0]
    };
  },

  // Others
  fetchLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    await sleep(1000);
    return [
      { college: 'MIT Academy', uploads: 450, rank: 1 },
      { college: 'Stanbridge Univ', uploads: 380, rank: 2 },
      { college: 'Tech Institute', uploads: 290, rank: 3 },
      { college: 'Global College', uploads: 150, rank: 4 }
    ];
  }
};
