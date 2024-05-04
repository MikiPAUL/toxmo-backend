const generateUrl = (url: string | null | undefined) => {
    if (!url) return null
    return `${process.env['CDN_URL']}/${url}`
}

export { generateUrl }