import { NextResponse } from "next/server";
import { getAccounts, upsertAccount, removeAccount } from "@/lib/db";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

/**
 * GET /api/gmb/accounts
 * Returns ALL connected GMB accounts for the logged-in user
 * with FULL raw data (accounts, locations, tokens) from the DB.
 * Connects to Google Business Information API & Account Management API.
 */
export async function GET(req) {
  const userId = req.headers.get("x-user-id") || req.nextUrl.searchParams.get("userId") || null;

  if (!userId || userId === "undefined" || userId === "null") {
    return NextResponse.json({ accounts: [], locations: [], error: "No userId provided" }, { status: 200 });
  }

  try {
    const dbAccounts = await getAccounts(userId);
    const gmbAccounts = dbAccounts.filter(a => a.platform === "gmb");

    if (gmbAccounts.length === 0) {
      return NextResponse.json({ accounts: [], locations: [] }, { status: 200 });
    }

    const allAccounts = [];
    const allLocations = [];

    for (const dbAcc of gmbAccounts) {
      const email = dbAcc.providerAccountId || dbAcc.name || "google.user@gmail.com";
      const connectedAt = dbAcc.connectedAt || new Date().toISOString();
      const accessToken = dbAcc.accessToken || null;
      const rawGmbAccounts = dbAcc.raw?.gmbAccounts || [];
      const storedLocations = dbAcc.raw?.locations || [];

      let fetchedFromApi = false;

      // Fetch live locations from Google API if access token exists
      if (accessToken) {
        try {
          // 1. Fetch accounts list from Google Account Management API
          let gmbAccountsToQuery = [];
          try {
            const accRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            const accData = await accRes.json();
            if (accData.accounts && accData.accounts.length > 0) {
              gmbAccountsToQuery = accData.accounts;
            }
          } catch (accErr) {
            console.warn("[GMB API] Account management fetch warning:", accErr.message);
          }

          // Fallback to accounts/- if no accounts returned
          if (gmbAccountsToQuery.length === 0) {
            gmbAccountsToQuery = [{ name: "accounts/-", accountName: email }];
          }

          // 2. Fetch locations for each account using Google Business Information API v1
          for (const gmbAcc of gmbAccountsToQuery) {
            const accId = gmbAcc.name;
            const accName = gmbAcc.accountName || gmbAcc.title || email;

            try {
              // Primary fetch with valid readMask
              let locRes = await fetch(
                `https://mybusinessbusinessinformation.googleapis.com/v1/${accId}/locations?readMask=name,title,storeCode,storefrontAddress,primaryCategory,websiteUri,phoneNumbers,metadata,regularHours`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
              );
              let locData = await locRes.json();

              // Fallback fetch without readMask if readMask errored out
              if (locData.error) {
                console.warn(`[GMB API] readMask error for ${accId}:`, locData.error?.message);
                locRes = await fetch(
                  `https://mybusinessbusinessinformation.googleapis.com/v1/${accId}/locations`,
                  { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                locData = await locRes.json();
              }

              if (locData.locations && locData.locations.length > 0) {
                fetchedFromApi = true;
                for (const loc of locData.locations) {
                  const addr = loc.storefrontAddress || {};
                  const addressLines = addr.addressLines || [];
                  const fullAddress = [
                    ...addressLines,
                    addr.locality,
                    addr.administrativeArea,
                    addr.postalCode
                  ].filter(Boolean).join(", ");

                  const locObj = {
                    locationId: loc.name || `locations/${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                    accountId: accId,
                    googleEmail: email,
                    storeCode: loc.storeCode || (loc.name ? loc.name.split("/").pop() : "GC-001"),
                    title: loc.title || "Business Location",
                    category: loc.primaryCategory?.displayName || loc.primaryCategory?.categoryId || "Business Services",
                    city: addr.locality || addr.administrativeArea || "India",
                    address: fullAddress || "Verified Business Address",
                    phone: loc.phoneNumbers?.primaryPhone || "+91 9511450914",
                    website: loc.websiteUri || "https://postfly.in",
                    rating: loc.profile?.averageRating || 5.0,
                    reviewCount: loc.profile?.totalReviewCount || 0,
                    completeness: calculateCompleteness(loc),
                    verified: true,
                    mapsUrl: loc.metadata?.mapsUri || "",
                    placeId: loc.metadata?.placeId || "",
                    regularHours: loc.regularHours?.periods || [],
                  };

                  if (!allLocations.some(l => l.locationId === locObj.locationId || l.title === locObj.title)) {
                    allLocations.push(locObj);
                  }
                }
              }
            } catch (locErr) {
              console.warn(`[GMB API] Location fetch error for ${accId}:`, locErr.message);
            }
          }
        } catch (apiErr) {
          console.warn("[GMB API] API root fetch error:", apiErr.message);
        }
      }

      // If API didn't return locations or token expired, load stored locations from DB
      if (allLocations.filter(l => l.googleEmail === email).length === 0 && storedLocations.length > 0) {
        for (const loc of storedLocations) {
          if (!allLocations.some(l => l.locationId === loc.locationId || l.title === loc.title)) {
            allLocations.push({ ...loc, googleEmail: email });
          }
        }
      }

      // Build account object
      const userLocations = allLocations.filter(l => l.googleEmail === email);
      allAccounts.push({
        accountId: `accounts/${String(dbAcc._id || Date.now())}`,
        accountName: email,
        googleEmail: email,
        role: "Owner",
        tokenStatus: accessToken ? "active" : "expired",
        scope: "business.manage",
        connectedDate: new Date(connectedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        connectedAt,
        locationCount: userLocations.length,
        verified: true,
        dbId: String(dbAcc._id || ""),
      });

      // Update DB with cached locations if fetched from API
      if (fetchedFromApi && userLocations.length > 0) {
        try {
          await upsertAccount({
            ...dbAcc,
            raw: {
              ...dbAcc.raw,
              locations: userLocations,
              locationsCount: userLocations.length
            }
          });
        } catch (updateErr) { /* silent */ }
      }
    }

    return NextResponse.json({
      accounts: allAccounts,
      locations: allLocations,
      totalAccounts: allAccounts.length,
      totalLocations: allLocations.length,
    }, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      }
    });

  } catch (err) {
    console.error("[GMB Accounts API] Error:", err);
    return NextResponse.json({ accounts: [], locations: [], error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/gmb/accounts
 * Disconnect a GMB account from DB
 */
export async function DELETE(req) {
  try {
    const { dbId, googleEmail } = await req.json();
    const userId = req.headers.get("x-user-id") || null;

    if (dbId) {
      await removeAccount(dbId, userId);
    }

    return NextResponse.json({ success: true, disconnected: googleEmail || dbId });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

function calculateCompleteness(loc) {
  const checks = [
    !!loc.title,
    !!loc.primaryCategory,
    !!(loc.storefrontAddress?.addressLines?.length),
    !!loc.phoneNumbers?.primaryPhone,
    !!loc.websiteUri,
    !!loc.regularHours?.periods?.length,
    !!loc.storeCode,
  ];
  const filled = checks.filter(Boolean).length;
  return Math.max(80, Math.round((filled / checks.length) * 100));
}
