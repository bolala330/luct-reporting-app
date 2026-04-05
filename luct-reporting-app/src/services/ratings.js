// Mock ratings service
export async function submitRating(ratingData) { return 'mock-id'; }
export async function getRatings(targetId, targetType) { return []; }
export function calculateAverageRating(ratings) { return 0; }