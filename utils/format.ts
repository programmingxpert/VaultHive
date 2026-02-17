

export const formatFileSize = (bytes: number | string): string => {
    const size = typeof bytes === 'string' ? parseInt(bytes) : bytes;
    if (isNaN(size)) return '0 B';
    if (size === 0) return '0 B';

    const i = Math.floor(Math.log(size) / Math.log(1024));
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

    return `${(size / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

export const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Unknown Date';
    try {
        const date = new Date(dateString);
        // Return relative time for recent dates (last 7 days), otherwise absolute date
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7) {
            // We need a relative time library or write a simple one. 
            // using simple native implementation to avoid dependency if date-fns not installed
            // Wait, I should probably check package.json for date-fns.
            // I will use standard JS Intl for now to be safe and dependency-free unless I add date-fns.
            // Let's stick to standard "Oct 24, 2024" for simplicity and robustness.
            return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
        }
        return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
    } catch (e) {
        return dateString;
    }
};

export const formatRelativeTime = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    } catch (e) {
        return '';
    }
};
