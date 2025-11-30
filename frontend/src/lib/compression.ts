import imageCompression from 'browser-image-compression';

export async function compressFile(file: File): Promise<Blob> {
    const imageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (imageTypes.includes(file.type)) {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1080,
            useWebWorker: true,
            fileType: 'image/webp',
        };

        try {
            const compressedBlob = await imageCompression(file, options);
            return compressedBlob;
        } catch (err) {
            console.error('Image compression failed:', err);
            return file;
        }
    }
    return file;
}
