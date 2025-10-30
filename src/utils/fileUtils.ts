import type { FileAttachment } from '../types';

/**
 * Tạo Blob từ FileAttachment (hỗ trợ file.file, data URL, hoặc URL từ server)
 */
export const getBlobFromFile = async (file: FileAttachment): Promise<Blob> => {
    if (file.file) {
        return file.file; // Đã là Blob
    }

    if (file.url?.startsWith('data:')) {
        // Xử lý data URL
        const arr = file.url.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || file.type || 'application/octet-stream';
        const bstr = atob(arr[1]);
        const n = bstr.length;
        const u8arr = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
            u8arr[i] = bstr.charCodeAt(i);
        }
        return new Blob([u8arr], { type: mime });
    }

    // Nếu là URL từ server → fetch về
    if (file.url) {
        const response = await fetch(file.url);
        if (!response.ok) throw new Error('Failed to fetch file');
        return await response.blob();
    }

    throw new Error('No valid file source');
};

/**
 * Download một Blob với tên file chỉ định
 */
export const downloadBlob = (blob: Blob, fileName: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 100);
};

/**
 * Kiểm tra xem file có phải là hình ảnh không
 */
export const isImageFile = (file: FileAttachment): boolean => {
    return file.type.startsWith('image/');
};

/**
 * Kiểm tra xem file có phải là video không
 */
export const isVideoFile = (file: File): boolean => {
    return file.type.startsWith('video/');
};

/**
 * Format kích thước file thành string dễ đọc
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
