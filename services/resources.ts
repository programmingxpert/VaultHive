import { supabase } from './supabase';
import { Resource, ResourceType, Privacy } from '../types';

export const resourcesService = {
    uploadResource: async (
        file: File,
        metadata: {
            title: string;
            subject: string;
            semester: string;
            college: string;
            uploaderId: string;
            uploaderName: string;
            uploaderAvatar?: string;
            type: ResourceType;
            year: string;
            tags: string[];
            description: string;
            privacy: Privacy;
        }
    ) => {
        // 1. Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${metadata.uploaderId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('resources')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('resources')
            .getPublicUrl(filePath);

        // 3. Insert metadata into Database
        const { data, error: dbError } = await supabase
            .from('resources')
            .insert([
                {
                    title: metadata.title,
                    subject: metadata.subject,
                    semester: metadata.semester,
                    college: metadata.college,
                    uploader_id: metadata.uploaderId,
                    uploader_name: metadata.uploaderName,
                    uploader_avatar: metadata.uploaderAvatar,
                    type: metadata.type,
                    year: metadata.year,
                    tags: metadata.tags,
                    description: metadata.description,
                    privacy: metadata.privacy,
                    file_url: publicUrl,
                    file_name: file.name,
                    file_size: file.size.toString(),
                    upload_date: new Date().toISOString(),
                    downloads: 0,
                },
            ])
            .select()
            .single();

        if (dbError) {
            // Cleanup file if DB insert fails
            await supabase.storage.from('resources').remove([filePath]);
            throw dbError;
        }

        return data;
    },

    getAllResources: async () => {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .order('upload_date', { ascending: false });

        if (error) throw error;
        return data.map((item: any) => ({
            ...item,
            uploaderId: item.uploader_id,
            uploaderName: item.uploader_name,
            uploaderAvatar: item.uploader_avatar,
            fileUrl: item.file_url,
            fileName: item.file_name,
            fileSize: item.file_size,
            uploadDate: item.upload_date,
            averageRating: item.average_rating
        })) as Resource[];
    },

    getUserResources: async (userId: string) => {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('uploader_id', userId)
            .order('upload_date', { ascending: false });

        if (error) throw error;
        return data.map((item: any) => ({
            ...item,
            uploaderId: item.uploader_id,
            uploaderName: item.uploader_name,
            uploaderAvatar: item.uploader_avatar,
            fileUrl: item.file_url,
            fileName: item.file_name,
            fileSize: item.file_size,
            uploadDate: item.upload_date,
            averageRating: item.average_rating
        })) as Resource[];
    },

    deleteResource: async (resourceId: string, fileUrl: string) => {
        // ... (delete logic unchanged)
        // 1. Delete from Storage
        // Extract path from URL: .../resources/userId/filename
        const path = fileUrl.split('/resources/')[1];
        if (path) {
            const { error: storageError } = await supabase.storage
                .from('resources')
                .remove([path]);

            if (storageError) console.error('Error deleting file:', storageError);
        }

        // 2. Delete from Database
        const { error } = await supabase
            .from('resources')
            .delete()
            .eq('id', resourceId);

        if (error) throw error;
    },

    updateResource: async (
        id: string,
        updates: Partial<{
            title: string;
            subject: string;
            semester: string;
            type: ResourceType;
            year: string;
            description: string;
            privacy: Privacy;
            tags: string[];
        }>
    ) => {
        const { error } = await supabase
            .from('resources')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
    },

    getAccessibleResources: async (
        userCollege: string,
        filters?: {
            search?: string;
            semester?: string;
            type?: string;
            branch?: string;
            year?: string;
            privacy?: string;
            sortBy?: 'latest' | 'oldest' | 'rating' | 'downloads';
        }
    ) => {
        let query = supabase
            .from('resources')
            .select('*');

        // 1. Privacy & Access Control Logic
        // Public resources OR (Private AND same college)
        query = query.or(`privacy.eq.Public,and(privacy.eq.Private,college.eq."${userCollege}")`);

        // 2. Search (Title, Subject, Description, Tags)
        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,subject.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        // 3. Filters
        if (filters?.semester && filters.semester !== 'All') {
            query = query.eq('semester', filters.semester);
        }

        if (filters?.type && filters.type !== 'All') {
            query = query.eq('type', filters.type);
        }

        if (filters?.branch && filters.branch !== 'All') {
            query = query.ilike('subject', `%${filters.branch}%`);
        }

        if (filters?.year && filters.year !== 'All') {
            query = query.eq('year', filters.year);
        }

        if (filters?.privacy && filters.privacy !== 'All') {
            query = query.eq('privacy', filters.privacy);
        }

        // 4. Sorting
        switch (filters?.sortBy) {
            case 'oldest':
                query = query.order('upload_date', { ascending: true });
                break;
            case 'rating':
                query = query.order('average_rating', { ascending: false });
                break;
            case 'downloads':
                query = query.order('downloads', { ascending: false });
                break;
            case 'latest':
            default:
                query = query.order('upload_date', { ascending: false });
                break;
        }

        const { data, error } = await query;

        if (error) throw error;

        return data.map((item: any) => ({
            ...item,
            uploaderId: item.uploader_id,
            uploaderName: item.uploader_name,
            uploaderAvatar: item.uploader_avatar,
            fileUrl: item.file_url,
            fileName: item.file_name,
            fileSize: item.file_size,
            uploadDate: item.upload_date,
            averageRating: item.average_rating
        })) as Resource[];
    },

    getResourceById: async (id: string) => {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            ...data,
            uploaderId: data.uploader_id,
            uploaderName: data.uploader_name,
            uploaderAvatar: data.uploader_avatar,
            fileUrl: data.file_url,
            fileName: data.file_name,
            fileSize: data.file_size,
            uploadDate: data.upload_date,
            averageRating: data.average_rating,
            reviews: [] // Reviews will be fetched separately
        } as Resource;
    },

    getReviews: async (resourceId: string) => {
        console.log('Fetching reviews for:', resourceId);
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('resource_id', resourceId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }

        console.log('Reviews fetched:', data);

        return data.map((r: any) => ({
            id: r.id,
            userId: r.user_id,
            userName: r.user_name,
            userAvatar: r.user_avatar,
            rating: r.rating,
            comment: r.comment,
            createdAt: new Date(r.created_at).toLocaleDateString()
        }));
    },

    addReview: async (resourceId: string, review: { userId: string, userName: string, userAvatar?: string, rating: number, comment: string }) => {
        const { data, error } = await supabase
            .from('reviews')
            .upsert([
                {
                    resource_id: resourceId,
                    user_id: review.userId,
                    user_name: review.userName,
                    user_avatar: review.userAvatar,
                    rating: review.rating,
                    comment: review.comment
                }
            ], { onConflict: 'resource_id, user_id' })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            userId: data.user_id,
            userName: data.user_name,
            userAvatar: data.user_avatar,
            rating: data.rating,
            comment: data.comment,
            createdAt: new Date(data.created_at).toLocaleDateString()
        };
    },

    deleteReview: async (reviewId: string) => {
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId);

        if (error) throw error;
    }
};
