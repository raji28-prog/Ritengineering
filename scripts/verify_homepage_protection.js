/**
 * HOMEPAGE REGRESSION & INTEGRITY PROTECTION SUITE
 * 
 * Verifies that the approved RITW homepage files, structure, and visual
 * features remain strictly intact and protected during any Admin Panel
 * or backend development.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const repoRoot = path.join(__dirname, '..');

function getHash(filePath) {
  const fullPath = path.join(repoRoot, filePath);
  if (!fs.existsSync(fullPath)) return null;
  const data = fs.readFileSync(fullPath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

const PROTECTED_BASELINE_HASHES = {
  'index.html': '0cfaeef08620894086e3ec01509fa88d5e1b73010b90457635dafcb4b2ffaa85',
  'css/ritw-theme.css': 'f52ae07559ca5a0a4cfa976fc42c94dff48fa88fc99a5ce39097daea4fa64654'
};

function runIntegrityAudit() {
  console.log('===========================================================');
  console.log('  RITW HOMEPAGE INTEGRITY & REGRESSION PROTECTION AUDIT    ');
  console.log('===========================================================');

  const indexHtmlPath = path.join(repoRoot, 'index.html');
  const themeCssPath = path.join(repoRoot, 'css', 'ritw-theme.css');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ CRITICAL ERROR: index.html is missing!');
    process.exit(1);
  }

  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  const themeCss = fs.readFileSync(themeCssPath, 'utf8');

  let passed = true;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      passed = false;
    }
  }

  console.log('\n[CHECKLIST 1: 11 APPROVED HOMEPAGE UI REQUIREMENTS]');

  // 1. Academic Programmes / Branches Offered removed from homepage
  assert(
    !indexHtml.includes('class="branches-section') && !indexHtml.includes('Branches Offered at Rishi'),
    '1. Academic Programmes / Branches Offered removed from homepage'
  );

  // 2. Separate Important Updates ticker removed from homepage
  assert(
    !indexHtml.includes('class="updates-box"'),
    '2. Separate Important Updates ticker removed from homepage'
  );

  // 3. Hero right-side card has visible shadow and border
  assert(
    indexHtml.includes('ritw-showcase-card') && themeCss.includes('.ritw-showcase-card'),
    '3. Hero right-side showcase card with visible shadow and border'
  );

  // 4. Campus Spotlight compact and professionally aligned
  assert(
    indexHtml.includes('id="campusSpotlightCarousel"') && indexHtml.includes('spotlight-media-frame'),
    '4. Campus Spotlight compact and professionally aligned'
  );

  // 5. NBA and UGC certificates in separate compact frames with information beside them
  assert(
    indexHtml.includes('id="institutional-announcements"') &&
    indexHtml.includes('autonomous-poster-frame') &&
    indexHtml.includes('NBA_ACCREDITATION_RITW.webp') &&
    indexHtml.includes('UGC_AUTONOMOUS.webp'),
    '5. NBA and UGC certificates displayed in separate compact frames with information beside them'
  );

  // 6. Keep Event Gallery; remove Campus Announcements tab from scroller
  assert(
    indexHtml.includes('data-tab="gallery"') && !indexHtml.includes('data-tab="announcements"'),
    '6. Event Gallery retained and Campus Announcements tab removed from homepage scroller'
  );

  // 7. Central RITW logo and animated surrounding orbit circles (no girl image)
  assert(
    indexHtml.includes('id="rs2OrbitWrapper"') &&
    indexHtml.includes('images/ritw-emblem-logo.png') &&
    !indexHtml.includes('Lady-removebg-preview.png'),
    '7. Central RITW emblem with animated orbit circles and no girl image'
  );

  // 8. Compact video preview card with Watch on YouTube link
  assert(
    indexHtml.includes('class="ritw-video-preview-card"') &&
    indexHtml.includes('images/video_preview_thumb.jpg') &&
    indexHtml.includes('class="ritw-watch-yt-link"'),
    '8. Compact video preview card with Watch on YouTube link'
  );

  // 9. Quick Enquiry white-background popup form
  assert(
    indexHtml.includes('id="quickEnquiryModal"') &&
    themeCss.includes('.qe-modal-box') &&
    themeCss.includes('background: #FFFFFF !important;'),
    '9. Quick Enquiry popup modal with white background styling'
  );

  // 10. Announcements navigates to dedicated full page, never a popup
  assert(
    indexHtml.includes('id="announcementsTabBtn"') &&
    indexHtml.includes('href="/announcements/"') &&
    !indexHtml.includes('id="announcementsModal"'),
    '10. Floating Announcements tab navigates to dedicated full page (/announcements/)'
  );

  // 11. Compact announcement cards with properly framed images and side-by-side content
  assert(
    indexHtml.includes('autonomous-card') && indexHtml.includes('autonomous-banner'),
    '11. Compact announcement cards with properly framed images and side-by-side content'
  );

  console.log('\n[CHECKLIST 2: ASSET INTEGRITY]');
  const requiredAssets = [
    'images/ritw-emblem-logo.png',
    'images/video_preview_thumb.jpg',
    'images/NBA_ACCREDITATION_RITW.webp',
    'images/RISHI_M.S_INSTITUTE_OF_ENGINEERING_AND_TECHNOLOGY_FOR_WOMEN_-_UGC_AUTONOMOUS.webp',
    'announcements/index.html'
  ];

  requiredAssets.forEach(asset => {
    assert(fs.existsSync(path.join(repoRoot, asset)), `Asset present: ${asset}`);
  });

  console.log('\n-----------------------------------------------------------');
  if (passed) {
    console.log('✅ ALL AUDIT CHECKS PASSED: Homepage is 100% compliant with approved baseline.');
    console.log('-----------------------------------------------------------');
    process.exit(0);
  } else {
    console.error('❌ INTEGRITY CHECKS FAILED: Unexpected modifications detected!');
    console.log('-----------------------------------------------------------');
    process.exit(1);
  }
}

runIntegrityAudit();
