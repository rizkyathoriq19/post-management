export function getImageUrl(image: string | null) {
    if (!image) return '/placeholder-image.png'

    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image
    }

    return `${process.env.NEXT_PUBLIC_API_URL}/src/uploads/${image}`
}
