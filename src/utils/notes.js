/**
 * UP-Notes Main Notes Module
 * Exporting note browsing, searching, filtering, popularity scoring, and fetching services.
 */

const browseHelper = require('./browseHelper');
const browseService = require('./browseService');

module.exports = {
  // Browse Helper Functions
  filterNotesBySearch: browseHelper.filterNotesBySearch,
  calculatePopularityScore: browseHelper.calculatePopularityScore,

  // Browse Service Functions
  getPublishedNotes: browseService.getPublishedNotes,
  getPublishedNoteById: browseService.getPublishedNoteById,
  CATEGORY_MAP: browseService.CATEGORY_MAP,
};
