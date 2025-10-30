import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import type { FileAttachment } from '../types';
import { isVideoFile } from '../utils/fileUtils';

export const useFileUpload = () => {
    const { t } = useTranslation();
    const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const newFiles: FileAttachment[] = [];
        const rejectedFiles: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Check if file is video and reject it
            if (isVideoFile(file)) {
                rejectedFiles.push(file.name);
                continue;
            }

            const reader = new FileReader();

            await new Promise((resolve) => {
                reader.onload = (e) => {
                    const fileAttachment: FileAttachment = {
                        id: `file_${Date.now()}_${Math.random().toString(36).substring(2)}`,
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        url: e.target?.result as string,
                        file: file,
                    };
                    newFiles.push(fileAttachment);
                    resolve(null);
                };
                reader.readAsDataURL(file);
            });
        }

        setAttachedFiles((prev) => [...prev, ...newFiles]);

        // Show error message if any video files were rejected
        if (rejectedFiles.length > 0) {
            toast.error(t('chat.videoNotSupported'), {
                duration: 4000,
                position: 'top-center'
            });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Only hide overlay if leaving the main container
        if (e.currentTarget === e.target) {
            setIsDragging(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        await handleFileSelect(e.dataTransfer.files);
    };

    const removeFile = (fileId: string) => {
        setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId));
    };

    const clearFiles = () => {
        setAttachedFiles([]);
    };

    return {
        attachedFiles,
        isDragging,
        handleFileSelect,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        removeFile,
        clearFiles,
        setAttachedFiles,
    };
};
