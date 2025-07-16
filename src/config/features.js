// Feature flags for the application
export const FEATURES = {
  // Set to true to use The Graph Protocol for referral data
  // Set to false to use the legacy block scanning approach
  USE_THE_GRAPH: true, // ✅ ETH subgraph deployed successfully!
  
  // The Graph subgraph URLs (update these after deployment)
  SUBGRAPH_URLS: {
    ethereum: 'https://api.studio.thegraph.com/query/116215/bnbmga-ethtest/v0.0.1', // Using v0.0.1 while v0.0.2 syncs
    bsc: 'https://api.studio.thegraph.com/query/116215/bnbmga-bn-btest/v0.0.1' // ✅ Back to v0.0.1 - more recent blocks!
  },
  
  // Block range settings for legacy approach
  BLOCK_RANGES: {
    ethereum: 1000n,
    bsc: 5000n // Increased from 1000n as per previous fix
  }
};

// Helper function to check if The Graph should be used
export const shouldUseTheGraph = () => {
  return FEATURES.USE_THE_GRAPH;
};

// Helper function to get subgraph URL for a network
export const getSubgraphUrl = (network) => {
  return FEATURES.SUBGRAPH_URLS[network];
};