import { X, Download } from 'lucide-react';
import { useEffect } from 'react';

interface ImageModalProps {
    imageUrl: string;
    fileName: string;
    onClose: () => void;
}

export default function ImageModal({ imageUrl, fileName, onClose }: ImageModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleDownload = () => {
        console.log("vào nè");

        try {
            // Convert data URL to Blob to avoid freeze
            const arr = imageUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr], { type: mime });

            // Create download link with Blob URL
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm p-8"
            onClick={onClose}
        >
            {/* Top Controls */}
            <div className="flex items-center justify-between w-full max-w-7xl mb-4">
                <div className="flex-1"></div>

                {/* File Name */}
                <div className="flex-1 flex justify-center">
                    <div className="bg-gray-900 bg-opacity-70 text-white px-4 py-2 rounded-lg">
                        <p className="text-sm font-medium">{fileName}</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex-1 flex justify-end gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDownload();
                        }}
                        className="p-2 bg-gray-900 bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all"
                        title="Download"
                    >
                        <Download size={24} />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-900 bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all"
                        title="Close"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center">
                <img
                    src={imageUrl}
                    alt={fileName}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
}
