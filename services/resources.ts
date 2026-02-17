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
            uploaderId: item.uploader_id, // Map snake_case to camelCase
            uploaderName: item.uploader_name,
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
            fileUrl: item.file_url,
            fileName: item.file_name,
            fileSize: item.file_size,
            uploadDate: item.upload_date,
            averageRating: item.average_rating
        })) as Resource[];
    },

    deleteResource: async (resourceId: string, fileUrl: string) => {
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
    }
};
