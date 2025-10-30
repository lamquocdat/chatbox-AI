import { Paperclip } from 'lucide-react';

interface DragDropOverlayProps {
    isVisible: boolean;
}

export default function DragDropOverlay({ isVisible }: DragDropOverlayProps) {
    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 z-40 bg-blue-500 bg-opacity-20 border-4 border-dashed border-blue-500 flex items-center justify-center">
            <div className="text-center">
                <Paperclip size={48} className="mx-auto mb-2 text-blue-500" />
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    Drop files here
                </p>
            </div>
        </div>
    );
}
