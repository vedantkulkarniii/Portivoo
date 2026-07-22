/**
 * Generate a unique subdomain for user portfolio
 * Format: subdomain.username.portivo.in
 */
const generateSubdomain = (username, userId) => {
  // Clean username: lowercase, remove spaces, special chars
  const cleanUsername = username
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20); // Limit length

  // Add userId hash for uniqueness
  const hash = userId.toString().slice(-6);

  return `${cleanUsername}-${hash}`;
};

module.exports = generateSubdomain;

