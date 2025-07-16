// src/utils/referralManager.js
// Simple address validation function
const isValidAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Referral Manager - Handles referral code to address mapping and URL parsing
 */

// In-memory storage for referral codes (in production, this would be a database)
const referralCodeMap = new Map();

// Storage key for localStorage
const REFERRAL_STORAGE_KEY = 'sada_referral_codes';
const CURRENT_REFERRER_KEY = 'sada_current_referrer';

/**
 * Load referral codes from localStorage
 */
const loadReferralCodes = () => {
  try {
    const stored = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (stored) {
      const codes = JSON.parse(stored);
      Object.entries(codes).forEach(([code, address]) => {
        referralCodeMap.set(code, address);
      });
    }
  } catch (error) {
    console.warn('Failed to load referral codes from localStorage:', error);
  }
};

/**
 * Save referral codes to localStorage
 */
const saveReferralCodes = () => {
  try {
    const codes = Object.fromEntries(referralCodeMap);
    localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(codes));
  } catch (error) {
    console.warn('Failed to save referral codes to localStorage:', error);
  }
};

/**
 * Initialize the referral manager
 */
export const initializeReferralManager = () => {
  try {
    loadReferralCodes();
    
    // Add some default referral codes for testing
    if (referralCodeMap.size === 0) {
      // These would normally come from your backend/database
      addReferralCode('67FAFDMCZBTTXE', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9');
      addReferralCode('TESTREF123', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9');
      addReferralCode('DEMO456', '0x8ba1f109551bD432803012645aac136c5c8b4d8b9');
    }
  } catch (error) {
    console.error('Error initializing referral manager:', error);
    // Continue without crashing the app
  }
};

/**
 * Add a referral code mapping
 * @param {string} code - The referral code
 * @param {string} address - The Ethereum address
 */
export const addReferralCode = (code, address) => {
  if (!code || !address) {
    throw new Error('Both code and address are required');
  }
  
  if (!isValidAddress(address)) {
    throw new Error('Invalid Ethereum address');
  }
  
  referralCodeMap.set(code.toUpperCase(), address.toLowerCase());
  saveReferralCodes();
};

/**
 * Get Ethereum address from referral code
 * @param {string} code - The referral code
 * @returns {string|null} - The Ethereum address or null if not found
 */
export const getReferrerAddress = (code) => {
  if (!code) return null;
  return referralCodeMap.get(code.toUpperCase()) || null;
};

/**
 * Generate a referral code for an address (simple implementation)
 * @param {string} address - The Ethereum address
 * @returns {string} - Generated referral code
 */
export const generateReferralCode = (address) => {
  if (!isValidAddress(address)) {
    throw new Error('Invalid Ethereum address');
  }
  
  // Simple code generation - in production, use a more sophisticated method
  const hash = address.slice(2, 14).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${hash}${timestamp}`;
};

/**
 * Extract referral code from URL
 * @param {string} url - The URL to parse (optional, defaults to current URL)
 * @returns {string|null} - The referral code or null if not found
 */
export const extractReferralCodeFromURL = (url = window.location.href) => {
  try {
    const urlObj = new URL(url);
    const refCode = urlObj.searchParams.get('ref');
    return refCode ? refCode.trim() : null;
  } catch (error) {
    console.warn('Failed to parse URL for referral code:', error);
    return null;
  }
};

/**
 * Set current referrer address in localStorage
 * @param {string} address - The referrer address
 */
export const setCurrentReferrer = (address) => {
  if (address && !isValidAddress(address)) {
    throw new Error('Invalid Ethereum address');
  }
  
  if (address) {
    localStorage.setItem(CURRENT_REFERRER_KEY, address.toLowerCase());
  } else {
    localStorage.removeItem(CURRENT_REFERRER_KEY);
  }
};

/**
 * Get current referrer address from localStorage
 * @returns {string|null} - The referrer address or null
 */
export const getCurrentReferrer = () => {
  try {
    const address = localStorage.getItem(CURRENT_REFERRER_KEY);
    return address && isValidAddress(address) ? address : null;
  } catch (error) {
    console.warn('Failed to get current referrer:', error);
    return null;
  }
};

/**
 * Process referral from URL and set current referrer
 * This should be called when the app loads
 */
export const processReferralFromURL = () => {
  try {
    const refCode = extractReferralCodeFromURL();
    
    if (refCode) {
      const referrerAddress = getReferrerAddress(refCode);
      
      if (referrerAddress) {
        setCurrentReferrer(referrerAddress);
        console.log(`Referral processed: ${refCode} -> ${referrerAddress}`);
        return referrerAddress;
      } else {
        console.warn(`Unknown referral code: ${refCode}`);
      }
    }
    
    return getCurrentReferrer();
  } catch (error) {
    console.error('Error processing referral from URL:', error);
    return null;
  }
};

/**
 * Get referrer address for purchase (with fallback to zero address)
 * @returns {string} - Referrer address or zero address
 */
export const getReferrerForPurchase = () => {
  const referrer = getCurrentReferrer();
  return referrer || '0x0000000000000000000000000000000000000000';
};

/**
 * Clear current referrer
 */
export const clearCurrentReferrer = () => {
  setCurrentReferrer(null);
};

/**
 * Get all referral codes (for admin/debug purposes)
 * @returns {Object} - Object with code -> address mappings
 */
export const getAllReferralCodes = () => {
  return Object.fromEntries(referralCodeMap);
};

/**
 * Check if a referral code exists
 * @param {string} code - The referral code to check
 * @returns {boolean} - True if code exists
 */
export const hasReferralCode = (code) => {
  return code ? referralCodeMap.has(code.toUpperCase()) : false;
};

/**
 * Get referral code for a specific address (reverse lookup)
 * @param {string} address - The Ethereum address
 * @returns {string|null} - The referral code or null if not found
 */
export const getReferralCodeForAddress = (address) => {
  if (!address) return null;
  
  const normalizedAddress = address.toLowerCase();
  for (const [code, addr] of referralCodeMap.entries()) {
    if (addr.toLowerCase() === normalizedAddress) {
      return code;
    }
  }
  return null;
};

/**
 * Generate referral link with code
 * @param {string} code - The referral code
 * @returns {string} - Complete referral URL
 */
export const generateReferralLink = (code) => {
  if (!code) return null;
  
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?ref=${code}`;
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

// Initialize when module loads
initializeReferralManager();