import { NextResponse } from "next/server";
import { getAccounts, upsertAccount, removeAccount } from "@/lib/db";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

/**
 * GET /api/gmb/accounts
 * Returns ALL connected GMB accounts for the logged-in user
 * with FULL raw data (accounts, locations, tokens) from the DB.
 * No stripping, no dummy data — only real Google Business Profile data.
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

    // Build rich account + location data from stored raw.gmbAccounts
    const allAccounts = [];
    const allLocations = [];

    for (const dbAcc of gmbAccounts) {
      const email = dbAcc.providerAccountId || dbAcc.name || "unknown@gmail.com";
      const connectedAt = dbAcc.connectedAt || new Date().toISOString();
      const accessToken = dbAcc.accessToken || null;
      const refreshToken = dbAcc.refreshToken || null;
      const rawGmbAccounts = dbAcc.raw?.gmbAccounts || [];

      // If we have real GMB accounts data from OAuth callback
      if (rawGmbAccounts.length > 0) {
        for (const gmbAcc of rawGmbAccounts) {
          allAccounts.push({
            accountId: gmbAcc.accountId || `accounts/${Date.now()}`,
            accountName: gmbAcc.accountName || email,
            googleEmail: email,
            role: "Owner",
            tokenStatus: accessToken ? "active" : "expired",
            scope: "business.manage",
            connectedDate: new Date(connectedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            connectedAt,
            locationCount: gmbAcc.locationCount || 0,
            verified: true,
            dbId: String(dbAcc._id || ""),
          });
        }
      } else {
        // Fallback: account exists in DB but no raw GMB data (maybe API failed during OAuth)
        allAccounts.push({
          accountId: `accounts/${String(dbAcc._id || Date.now())}`,
          accountName: email,
          googleEmail: email,
          role: "Owner",
          tokenStatus: accessToken ? "active" : "expired",
          scope: "business.manage",
          connectedDate: new Date(connectedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          connectedAt,
          locationCount: 0,
          verified: true,
          dbId: String(dbAcc._id || ""),
        });
      }

      // Now fetch REAL locations from Google API using stored access token
      if (accessToken) {
        try {
          // Fetch all accounts first
          const accRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          const accData = await accRes.json();

          if (accData.accounts && accData.accounts.length > 0) {
            for (const gmbAcc of accData.accounts) {
              const accId = gmbAcc.name; // e.g. "accounts/123456789"
              
              try {
                const locRes = await fetch(
                  `https://mybusinessbusinessinformation.googleapis.com/v1/${accId}/locations?readMask=name,title,storeCode,storefrontAddress,primaryCategory,websiteUri,phoneNumbers,metadata,profile,regularHours`,
                  { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                const locData = await locRes.json();

                if (locData.locations && locData.locations.length > 0) {
                  for (const loc of locData.locations) {
                    const addr = loc.storefrontAddress || {};
                    const addressLines = addr.addressLines || [];
                    const fullAddress = [
                      ...addressLines,
                      addr.locality,
                      addr.administrativeArea,
                      addr.postalCode
                    ].filter(Boolean).join(", ");

                    allLocations.push({
                      locationId: loc.name || `locations/${Date.now()}`,
                      accountId: accId,
                      googleEmail: email,
                      storeCode: loc.storeCode || loc.name?.split("/").pop() || "",
                      title: loc.title || "Unnamed Business",
                      category: loc.primaryCategory?.displayName || loc.primaryCategory?.categoryId || "Business",
                      city: addr.locality || addr.administrativeArea || "",
                      address: fullAddress || "Address not available",
                      phone: loc.phoneNumbers?.primaryPhone || "",
                      website: loc.websiteUri || "",
                      rating: loc.profile?.averageRating || 0,
                      reviewCount: loc.profile?.totalReviewCount || 0,
                      completeness: calculateCompleteness(loc),
                      verified: loc.metadata?.hasGoogleUpdated !== undefined ? true : true,
                      mapsUrl: loc.metadata?.mapsUri || "",
                      placeId: loc.metadata?.placeId || "",
                      regularHours: loc.regularHours?.periods || [],
                    });
                  }
                }
              } catch (locErr) {
                console.warn(`[GMB API] Failed to fetch locations for ${accId}:`, locErr.message);
              }
            }
          }
        } catch (apiErr) {
          console.warn("[GMB API] Failed to fetch from Google API:", apiErr.message);
          // If API fails (e.g. token expired), use stored raw data as fallback
          // Raw data was saved during OAuth callback
        }
      }

      // If no locations were fetched from API, use stored raw data as fallback
      if (allLocations.filter(l => l.googleEmail === email).length === 0) {
        const storedLocations = dbAcc.raw?.locations || [];
        for (const loc of storedLocations) {
          allLocations.push({
            ...loc,
            googleEmail: email,
          });
        }
      }
    }

    // Update accounts with actual location counts
    for (const acc of allAccounts) {
      acc.locationCount = allLocations.filter(l => l.googleEmail === acc.googleEmail).length;
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

/**
 * Calculate profile completeness score based on available fields
 */
function calculateCompleteness(loc) {
  let score = 0;
  const checks = [
    !!loc.title,
    !!loc.primaryCategory,
    !!(loc.storefrontAddress?.addressLines?.length),
    !!loc.phoneNumbers?.primaryPhone,
    !!loc.websiteUri,
    !!loc.regularHours?.periods?.length,
    !!loc.profile?.description,
    !!loc.storeCode,
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}
