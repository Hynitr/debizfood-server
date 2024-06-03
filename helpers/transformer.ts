export const titleText = (text: string) => {
    return text.trim()
        .split(" ")
        .map(txt => txt[0].toUpperCase() + txt.slice(1).toLowerCase())
        .join(" ")
}

export const toLowerCase = (text: string) => text.toLowerCase().trim()

export const toUpperCase = (text: string) => text.toUpperCase().trim()

export const normalizePhoneNumber = (phoneNumber: string) => {
    let normalized = phoneNumber.replace(/\D/g, '')

    if (normalized.startsWith('0')) {
        normalized = normalized.slice(1)
    }

    if (normalized.startsWith('00')) {
        normalized = normalized.slice(2)
    } else if (normalized.startsWith('+')) {
        normalized = normalized.slice(1)
    }

    return normalized
}