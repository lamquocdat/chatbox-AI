import { X, FileText, Film, File } from 'lucide-react';
import { FileAttachment } from '../types';

interface FilePreviewProps {
    file: FileAttachment;
    onRemove?: () => void;
    onClick?: () => void;
}

export default function FilePreview({ file, onRemove, onClick }: FilePreviewProps) {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isPDF = file.type === 'application/pdf';

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileIcon = () => {
        if (isImage) return null; // Will show thumbnail
        if (isVideo) return <Film size={24} className="text-purple-500" />;
        if (isPDF) return <FileText size={24} className="text-red-500" />;
        return <File size={24} className="text-blue-500" />;
    };

    return (
        <div
            className="relative group inline-block rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            {/* Preview Area */}
            <div className="w-32 h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                {isImage ? (
                    <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                        {getFileIcon()}
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate w-full text-center">
                            {file.name.split('.').pop()?.toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {/* File Info */}
            <div className="px-2 py-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium truncate text-gray-900 dark:text-gray-100" title={file.name}>
                    {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                </p>
            </div>

            {/* Remove Button */}
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                    <X size={12} />
                </button>
            )}
        </div>
    );
}
