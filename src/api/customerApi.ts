import api from './client';

export interface UploadProfileImageResponse {
    imageUrl: string;
    imageKey: string;
}

export interface UpdateProfilePayload {
    name?: string;
    email?: string;
    profileImage?: string | null;
    profileImageType?: 'upload' | 'avatar' | null;
    profileAvatarId?: string | null;
}

export const uploadProfileImage = async (formData: FormData) => {
    return api.postFormData<UploadProfileImageResponse>('/user/profile-image/upload', formData);
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
    return api.patch<{ user: any; message: string }>('/user', payload);
};

export default {
    uploadProfileImage,
    updateProfile,
};
