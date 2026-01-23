export const resolveStorageUrl = (path: string | null | undefined) => {
    if (!path) return '';

    // If it's already a full URL, return it
    if (path.startsWith('http') || path.startsWith('https') || path.startsWith('data:')) {
        return path;
    }

    const storageBase = import.meta.env.VITE_STORAGE_URL || 'http://localhost:9000/mathflix';

    // If path starts with /storage/, replace it with the storage base
    if (path.startsWith('/storage/')) {
        return `${storageBase}${path.replace('/storage/', '/')}`;
    }

    // Fallback for legacy /uploads/
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    if (path.startsWith('/uploads/')) {
        return `${apiBase}${path}`;
    }

    return path;
};
