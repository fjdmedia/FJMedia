// ============================================================
// FJMedia Dashboard — Google Apps Script Backend
// ============================================================
// Deploy as: Web App → Execute as Me → Anyone can access
// This script pulls GA4 analytics + Google Sheets form data
// and returns JSON for the dashboard frontend.
//
// SETUP:
// 1. Create new Google Sheet → Extensions → Apps Script
// 2. Paste this entire script into Code.gs
// 3. Enable the "Google Analytics Data API" advanced service:
//    - In Apps Script editor, click "+" next to Services (left sidebar)
//    - Search for "Google Analytics Data API"
//    - Click Add (keep default identifier: AnalyticsData)
// 4. Update CLIENT_CONFIG below with your property IDs + sheet IDs
// 5. Deploy → Web App → Execute as Me → Anyone → Deploy
// 6. Copy the URL and paste it into dashboard.html (replace REPLACE_WITH_GAS_URL)
// ============================================================

// ===== CLIENT CONFIG =====
// GA4 Property ID: Find in Google Analytics → Admin → Property Settings → Property ID (numeric)
// Sheet ID: The long string in the Google Sheet URL between /d/ and /edit
// Sheet Tab: The name of the tab with form submissions
// Columns: Which columns hold Name, Contact, and Date (A=1, B=2, etc.)

var CLIENT_CONFIG = {
  fjmedia: {
    ga4PropertyId: '531280834',
    sheets: [
      {
        id: '1AyHei_krygzoXmcJG-99xcSDYJg_pTRgiE2h2c-_jJk',     // "FJMedia — Leads" sheet
        tab: 'Sheet1',                                             // Tab name where form data lives
        nameCol: 2,                                                // Column B = Name
        contactCol: 3,                                             // Column C = Contact
        dateCol: 1,                                                // Column A = Timestamp
        detailsCol: 4,                                             // Column D = Details/Services
        headerRows: 1                                              // Skip 1 header row
      },
      {
        id: '1RYdRUeFw0XykXGY1tZYxkIlhpvfY4qvwTXF7dyXzxhQ',     // "FJMedia — Calculator Leads" sheet
        tab: 'Calculator Leads',
        nameCol: 2,
        contactCol: 3,
        dateCol: 1,
        detailsCol: 4,
        headerRows: 1
      }
    ]
  }
  // Add more clients later:
  // sugar_shai: { ga4PropertyId: '...', sheets: [...] },
  // diego_andrea: { ga4PropertyId: '...', sheets: [] }
};


// ===== WEB APP ENTRY POINT =====
function doGet(e) {
  var client = (e.parameter.client || 'fjmedia').toLowerCase();
  var days   = parseInt(e.parameter.days) || 30;

  var config = CLIENT_CONFIG[client];
  if (!config) {
    return jsonResponse({ error: 'Unknown client: ' + client });
  }

  var result = {
    client: client,
    days: days,
    visitors: { current: 0, previous: 0 },
    leads: { current: 0, previous: 0 },
    sources: [],
    pages: [],
    submissions: []
  };

  // Pull GA4 data (if property ID is set)
  if (config.ga4PropertyId && config.ga4PropertyId.indexOf('REPLACE') === -1) {
    try {
      var gaData = getGA4Data(config.ga4PropertyId, days);
      result.visitors = gaData.visitors;
      result.sources = gaData.sources;
      result.pages = gaData.pages;
    } catch (err) {
      Logger.log('GA4 error for ' + client + ': ' + err.toString());
      // Continue without GA data — Sheets data still works
    }
  }

  // Pull Sheets data (form submissions)
  if (config.sheets && config.sheets.length > 0) {
    try {
      var sheetsData = getSheetsData(config.sheets, days);
      result.leads = sheetsData.leads;
      result.submissions = sheetsData.submissions;
    } catch (err) {
      Logger.log('Sheets error for ' + client + ': ' + err.toString());
    }
  }

  return jsonResponse(result);
}


// ===== GA4 DATA =====
function getGA4Data(propertyId, days) {
  var today = new Date();
  var startDate = daysAgo(today, days);
  var prevStart = daysAgo(today, days * 2);
  var prevEnd   = daysAgo(today, days + 1);

  // --- Visitors (current vs previous period) ---
  var visitorsReq = AnalyticsData.Properties.runReport({
    dateRanges: [
      { startDate: formatDate(startDate), endDate: formatDate(today) },
      { startDate: formatDate(prevStart), endDate: formatDate(prevEnd) }
    ],
    metrics: [{ name: 'totalUsers' }]
  }, 'properties/' + propertyId);

  var currentVisitors = 0;
  var previousVisitors = 0;
  if (visitorsReq.rows) {
    visitorsReq.rows.forEach(function(row) {
      var val = parseInt(row.metricValues[0].value) || 0;
      if (row.metricValues.length > 1) {
        currentVisitors = parseInt(row.metricValues[0].value) || 0;
        previousVisitors = parseInt(row.metricValues[1].value) || 0;
      } else {
        // Single date range per row
        currentVisitors = val;
      }
    });
  }

  // If the multi-date-range approach gives us rows differently, handle it:
  if (visitorsReq.rows && visitorsReq.rows.length >= 2) {
    currentVisitors = parseInt(visitorsReq.rows[0].metricValues[0].value) || 0;
    previousVisitors = parseInt(visitorsReq.rows[1].metricValues[0].value) || 0;
  } else if (visitorsReq.rows && visitorsReq.rows.length === 1) {
    currentVisitors = parseInt(visitorsReq.rows[0].metricValues[0].value) || 0;
    previousVisitors = 0;
  }

  // --- Traffic Sources ---
  var sourcesReq = AnalyticsData.Properties.runReport({
    dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(today) }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 6
  }, 'properties/' + propertyId);

  var sources = [];
  var totalSessions = 0;
  if (sourcesReq.rows) {
    sourcesReq.rows.forEach(function(row) {
      totalSessions += parseInt(row.metricValues[0].value) || 0;
    });
    sourcesReq.rows.forEach(function(row) {
      var sessions = parseInt(row.metricValues[0].value) || 0;
      var pct = totalSessions > 0 ? Math.round((sessions / totalSessions) * 100) : 0;
      sources.push({
        name: row.dimensionValues[0].value,
        sessions: sessions,
        pct: pct
      });
    });
  }

  // --- Top Pages ---
  var pagesReq = AnalyticsData.Properties.runReport({
    dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(today) }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 5
  }, 'properties/' + propertyId);

  var pages = [];
  if (pagesReq.rows) {
    pagesReq.rows.forEach(function(row) {
      pages.push({
        path: row.dimensionValues[0].value,
        views: parseInt(row.metricValues[0].value) || 0
      });
    });
  }

  return {
    visitors: { current: currentVisitors, previous: previousVisitors },
    sources: sources,
    pages: pages
  };
}


// ===== SHEETS DATA =====
function getSheetsData(sheetsConfig, days) {
  var today = new Date();
  var startDate = daysAgo(today, days);
  var prevStart = daysAgo(today, days * 2);
  var prevEnd   = daysAgo(today, days + 1);

  var allSubmissions = [];
  var currentCount = 0;
  var previousCount = 0;

  sheetsConfig.forEach(function(cfg) {
    if (cfg.id.indexOf('REPLACE') !== -1) return;

    try {
      var ss = SpreadsheetApp.openById(cfg.id);
      var sheet = ss.getSheetByName(cfg.tab);
      if (!sheet) {
        // Try first sheet if tab name doesn't match
        sheet = ss.getSheets()[0];
      }

      var data = sheet.getDataRange().getValues();

      for (var i = cfg.headerRows; i < data.length; i++) {
        var row = data[i];
        var dateVal = row[cfg.dateCol - 1];
        var rowDate = dateVal ? new Date(dateVal) : null;

        if (!rowDate || isNaN(rowDate.getTime())) continue;

        var name    = String(row[cfg.nameCol - 1] || '').trim();
        var contact = String(row[cfg.contactCol - 1] || '').trim();
        var details = cfg.detailsCol ? String(row[cfg.detailsCol - 1] || '').trim() : '';

        // Current period
        if (rowDate >= startDate && rowDate <= today) {
          currentCount++;
          allSubmissions.push({
            name: name,
            contact: contact,
            date: Utilities.formatDate(rowDate, 'America/Winnipeg', 'MMM d, yyyy'),
            details: details,
            sortDate: rowDate.getTime()
          });
        }
        // Previous period (for comparison)
        else if (rowDate >= prevStart && rowDate <= prevEnd) {
          previousCount++;
        }
      }
    } catch (err) {
      Logger.log('Error reading sheet ' + cfg.id + ': ' + err.toString());
    }
  });

  // Sort submissions newest first, limit to 20
  allSubmissions.sort(function(a, b) { return b.sortDate - a.sortDate; });
  allSubmissions = allSubmissions.slice(0, 20);

  // Remove sortDate from response
  allSubmissions.forEach(function(s) { delete s.sortDate; });

  return {
    leads: { current: currentCount, previous: previousCount },
    submissions: allSubmissions
  };
}


// ===== HELPERS =====
function daysAgo(from, n) {
  var d = new Date(from);
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(d) {
  return Utilities.formatDate(d, 'America/Winnipeg', 'yyyy-MM-dd');
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
