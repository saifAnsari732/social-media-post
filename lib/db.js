import clientPromise from "./mongodb";
import crypto from "crypto";

async function getDb() {
  const client = await clientPromise;
  return client.db("postfly");
}

export function hashPassword(password) {
  if (!password) return "";
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

export async function addSystemLog(logData) {
  try {
    const db = await getDb();
    const newLog = {
      logId: `log_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: logData.timestamp || new Date().toISOString(),
      type: logData.type || "SYSTEM_EVENT",
      level: logData.level || "INFO",
      source: logData.source || "System",
      message: logData.message || "Event recorded",
      details: logData.details || {}
    };
    await db.collection("system_logs").insertOne(newLog);
    return newLog;
  } catch (err) {
    console.error("Failed to insert system log:", err);
  }
}

export async function registerUser({ name, email, password }) {
  const db = await getDb();
  const cleanEmail = (email || "").toLowerCase().trim();
  const cleanName = (name || "").trim();

  if (!cleanEmail) throw new Error("Email address is required.");
  if (!cleanName) throw new Error("Full name is required.");
  if (!password || String(password).length < 4) throw new Error("Password must be at least 4 characters.");

  const existing = await db.collection("users").findOne({ email: cleanEmail });
  if (existing) {
    throw new Error("An account with this email already exists. Please Sign In instead!");
  }

  const userId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const isAdminUser = 
    cleanEmail.includes("ansari") || 
    cleanEmail.includes("saif") || 
    cleanEmail === "ansarisaifuddin732@gmail.com" ||
    cleanEmail.includes("admin");

  const role = isAdminUser ? "admin" : "user";
  const plan = isAdminUser ? "Super Admin (Unrestricted)" : "5-Day Trial";
  const passwordHash = hashPassword(password);

  const newUser = {
    userId,
    name: cleanName,
    email: cleanEmail,
    role,
    plan,
    status: "Active",
    passwordHash,
    trialStartDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  await db.collection("users").insertOne(newUser);

  await addSystemLog({
    type: "USER_REGISTERED",
    level: "SUCCESS",
    source: "Authentication Service",
    message: `New user account registered: ${cleanName} (${cleanEmail}) as [${role.toUpperCase()}]`,
    details: { userId, email: cleanEmail, role, plan }
  });

  const { passwordHash: _, ...safeUser } = newUser;
  return safeUser;
}

export async function authenticateUser({ email, password, name }) {
  const db = await getDb();
  const cleanEmail = (email || "").toLowerCase().trim();

  if (!cleanEmail) throw new Error("Email address is required.");

  let user = await db.collection("users").findOne({ email: cleanEmail });

  if (!user) {
    if (password) {
      return registerUser({ name: name || cleanEmail.split("@")[0], email: cleanEmail, password });
    } else {
      throw new Error("No account found with this email. Please Sign Up to create an account!");
    }
  }

  if (user.status === "Blocked" || user.status === "Suspended") {
    throw new Error("Your account has been blocked by the Super Admin. Please contact support.");
  }

  if (password && user.passwordHash) {
    const inputHash = hashPassword(password);
    if (inputHash !== user.passwordHash) {
      throw new Error("Invalid password. Please check your credentials and try again.");
    }
  } else if (password && !user.passwordHash) {
    const passwordHash = hashPassword(password);
    await db.collection("users").updateOne(
      { email: cleanEmail },
      { $set: { passwordHash, updatedAt: new Date().toISOString() } }
    );
  }

  await db.collection("users").updateOne(
    { email: cleanEmail },
    { $set: { lastLoginAt: new Date().toISOString(), updatedAt: new Date().toISOString() } }
  );

  await addSystemLog({
    type: "AUTH_SESSION",
    level: "INFO",
    source: "Identity Gateway",
    message: `User session authenticated for ${user.name || cleanEmail} (${user.role || 'user'})`,
    details: { email: cleanEmail, userId: user.userId, role: user.role }
  });

  const updatedUser = await db.collection("users").findOne({ email: cleanEmail });
  const { passwordHash: _, ...safeUser } = updatedUser;
  return safeUser;
}

export async function findUserByEmail(email) {
  const db = await getDb();
  const cleanEmail = (email || "").toLowerCase().trim();
  if (!cleanEmail) return null;
  const user = await db.collection("users").findOne({ email: cleanEmail });
  if (!user) return null;
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

export async function resetPasswordByEmail({ email, newPassword }) {
  const db = await getDb();
  const cleanEmail = (email || "").toLowerCase().trim();
  if (!cleanEmail) throw new Error("Email address is required.");
  if (!newPassword || String(newPassword).length < 4) {
    throw new Error("Password must be at least 4 characters long.");
  }

  const user = await db.collection("users").findOne({ email: cleanEmail });
  if (!user) {
    throw new Error("No account found with this email address.");
  }

  const passwordHash = hashPassword(newPassword);
  await db.collection("users").updateOne(
    { email: cleanEmail },
    { $set: { passwordHash, updatedAt: new Date().toISOString() } }
  );

  await addSystemLog({
    type: "PASSWORD_RESET",
    level: "SUCCESS",
    source: "Authentication Service",
    message: `Password reset successfully for ${user.name || cleanEmail}`,
    details: { email: cleanEmail, userId: user.userId }
  });

  return { success: true, message: "Password updated successfully." };
}

// ── USERS ──
export async function upsertUser(user) {
  const db = await getDb();
  
  // Set role: Saif is Admin, everyone else is User
  const emailLower = (user.email || "").toLowerCase().trim();
  const isAdminUser = 
    emailLower.includes("ansari") || 
    emailLower.includes("saif") || 
    emailLower === "ansarisaifuddin732@gmail.com" ||
    emailLower.includes("admin");

  const existingUser = await db.collection("users").findOne({ email: emailLower });
  const role = existingUser?.role || (isAdminUser ? "admin" : "user");
  const plan = existingUser?.plan || user.plan || "5-Day Trial";
  const trialStartDate = existingUser?.trialStartDate || user.trialStartDate || new Date().toISOString();

  const userDoc = {
    ...user,
    email: emailLower,
    role,
    plan,
    trialStartDate,
    updatedAt: new Date().toISOString()
  };

  await db.collection("users").updateOne(
    { email: emailLower },
    { $set: userDoc },
    { upsert: true }
  );
  return db.collection("users").findOne({ email: emailLower });
}

export async function getUserById(userId) {
  if (!userId) return null;
  const db = await getDb();
  const superAdminEmail = "ansarisaifuddin732@gmail.com";
  const isRootId = userId === "eb994f0c8e6f7fb4c2629561" || userId === "super_admin";

  let user = await db.collection("users").findOne({ 
    $or: [{ userId }, { email: String(userId).toLowerCase() }] 
  });

  if (!user && (isRootId || String(userId).includes("ansari") || String(userId).includes("saif"))) {
    const adminDoc = {
      userId: "eb994f0c8e6f7fb4c2629561",
      name: "Saifuddin Ansari",
      email: superAdminEmail,
      role: "admin",
      plan: "Super Admin (Unrestricted)",
      status: "Active",
      trialStartDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await db.collection("users").updateOne(
      { email: superAdminEmail },
      { $set: adminDoc },
      { upsert: true }
    );
    user = await db.collection("users").findOne({ email: superAdminEmail });
  }

  return user;
}

export function isUserTrialExpired(user) {
  if (!user) return true;
  const emailLower = (user.email || "").toLowerCase().trim();
  const planName = (user.plan || "").toLowerCase().trim();
  
  // Super Admin / Root is unrestricted
  if (
    user.role === "admin" ||
    emailLower === "ansarisaifuddin732@gmail.com" ||
    emailLower.includes("ansari") ||
    emailLower.includes("saif") ||
    planName.includes("admin") ||
    planName.includes("unrestricted")
  ) {
    return false;
  }
  
  // Paid plans (Starter, Growth, Pro, Agency) are active
  const isPaidPlan = 
    (planName.includes("starter") || planName.includes("growth") || planName.includes("pro") || planName.includes("agency") || planName.includes("unlimited")) &&
    !planName.includes("trial");

  if (isPaidPlan) {
    return false;
  }

  // 5-Day Free Trial calculation
  const start = new Date(user.trialStartDate || user.createdAt || Date.now());
  const now = new Date();
  const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return diffDays >= 5 || planName.includes("expired") || planName.includes("blocked");
}

export async function updateUserPlan(userId, planName, transactionDetails = {}) {
  const db = await getDb();
  const user = await db.collection("users").findOne({ userId });

  await db.collection("users").updateOne(
    { userId },
    { 
      $set: { 
        plan: planName,
        planUpdatedAt: new Date().toISOString()
      } 
    }
  );

  // Record transaction in billing_history collection with full invoice details
  if (transactionDetails.orderId || transactionDetails.paymentId) {
    const invCount = await db.collection("billing_history").countDocuments();
    const invoiceId = `INV-${new Date().getFullYear()}-${String(invCount + 1).padStart(4, "0")}`;
    
    await db.collection("billing_history").insertOne({
      invoiceId,
      userId,
      userName: user?.name || "Subscriber",
      userEmail: user?.email || "user@example.com",
      planName,
      originalAmount: transactionDetails.originalAmount || (planName.includes("Pro") ? 3999 : planName.includes("Growth") ? 1999 : 999),
      discountAmount: transactionDetails.discountAmount || 0,
      amountPaid: transactionDetails.amountPaid || (planName.includes("Pro") ? 3999 : planName.includes("Growth") ? 1999 : 999),
      couponCode: transactionDetails.couponCode || "None",
      paymentId: transactionDetails.paymentId || `pay_${Date.now().toString().slice(-8)}`,
      orderId: transactionDetails.orderId || `order_${Date.now().toString().slice(-8)}`,
      paymentMethod: transactionDetails.paymentMethod || "Razorpay (Online Payment)",
      status: "PAID",
      createdAt: new Date().toISOString(),
      billingAddress: transactionDetails.billingAddress || "India"
    });
  }

  return db.collection("users").findOne({ userId });
}

export async function adminUpdateUser(userId, updates) {
  const db = await getDb();
  await db.collection("users").updateOne(
    { userId },
    { 
      $set: { 
        ...updates,
        updatedAt: new Date().toISOString()
      } 
    }
  );
  return db.collection("users").findOne({ userId });
}

export async function getUserBillingHistory(userId) {
  const db = await getDb();
  return db.collection("billing_history").find({ userId }).sort({ createdAt: -1 }).toArray();
}

export async function getAllInvoices() {
  const db = await getDb();
  return db.collection("billing_history").find({}).sort({ createdAt: -1 }).toArray();
}

export async function getAllUsers() {
  const db = await getDb();
  
  // Ensure Super Admin user exists in DB if empty
  const superAdminEmail = "ansarisaifuddin732@gmail.com";
  const existingAdmin = await db.collection("users").findOne({ email: superAdminEmail });
  if (!existingAdmin) {
    await db.collection("users").insertOne({
      userId: "eb994f0c8e6f7fb4c2629561",
      name: "Saifuddin Ansari",
      email: superAdminEmail,
      role: "admin",
      plan: "Super Admin (Unrestricted)",
      status: "Active",
      trialStartDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // Clean up any legacy dummy tenants if present
  await db.collection("users").deleteMany({
    email: { $in: ["brook.sim@example.com", "dwayne.t@agency.com", "rahul.s@business.in"] }
  });
  await db.collection("billing_history").deleteMany({
    userEmail: { $in: ["brook.sim@example.com", "dwayne.t@agency.com", "rahul.s@business.in"] }
  });

  const users = await db.collection("users").find({}).sort({ createdAt: -1 }).toArray();

  const withCounts = await Promise.all(
    users.map(async (u) => {
      const [accountsCount, postsCount] = await Promise.all([
        db.collection("accounts").countDocuments({ 
          $or: [{ userId: u.userId }, { userId: String(u.userId) }] 
        }),
        db.collection("posts").countDocuments({ 
          $or: [{ userId: u.userId }, { userId: String(u.userId) }] 
        })
      ]);
      return {
        ...u,
        accountsCount,
        postsCount
      };
    })
  );
  return withCounts;
}

export async function adminCreateUser(userData) {
  const db = await getDb();
  const userId = `usr_${Date.now().toString(36)}`;
  const emailLower = (userData.email || "").toLowerCase().trim();
  const newUser = {
    userId,
    name: userData.name || "New Tenant",
    email: emailLower,
    role: userData.role || "user",
    plan: userData.plan || "5-Day Trial",
    status: userData.status || "Active",
    trialStartDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await db.collection("users").insertOne(newUser);
  return newUser;
}

export async function adminDeleteUser(userId) {
  const db = await getDb();
  await Promise.all([
    db.collection("users").deleteOne({ userId }),
    db.collection("accounts").deleteMany({ userId }),
    db.collection("posts").deleteMany({ userId })
  ]);
  return { success: true };
}

export async function getAdminStats() {
  const db = await getDb();
  const [totalUsers, totalPosts, totalAccounts, totalRules, totalCoupons, paidUsersCount] = await Promise.all([
    db.collection("users").countDocuments(),
    db.collection("posts").countDocuments(),
    db.collection("accounts").countDocuments(),
    db.collection("rules").countDocuments(),
    db.collection("coupons").countDocuments({ status: "active" }),
    db.collection("users").countDocuments({ 
      plan: { $nin: ["5-Day Trial", "Starter Free", "trial", null, ""] } 
    })
  ]);

  return {
    totalUsers,
    totalPosts,
    totalAccounts,
    totalRules,
    activeCoupons: totalCoupons,
    paidUsers: paidUsersCount
  };
}

// ── COUPONS & DISCOUNTS ──

export async function getAllCoupons() {
  const db = await getDb();
  return db.collection("coupons").find({}).sort({ createdAt: -1 }).toArray();
}

export async function createCoupon(couponData) {
  const db = await getDb();
  const code = (couponData.code || "").toUpperCase().trim().replace(/[^A-Z0-9_-]/g, "");
  if (!code) throw new Error("Coupon code is required");

  const existing = await db.collection("coupons").findOne({ code });
  if (existing) {
    throw new Error(`Coupon "${code}" already exists`);
  }

  const newCoupon = {
    couponId: `cpn_${Date.now().toString(36)}`,
    code,
    type: couponData.type === "fixed" ? "fixed" : "percentage",
    value: Number(couponData.value) || 10,
    description: couponData.description || `${couponData.value}${couponData.type === "fixed" ? " INR" : "%"} discount`,
    maxUses: Number(couponData.maxUses) || 0,
    usedCount: 0,
    minAmount: Number(couponData.minAmount) || 0,
    expiryDate: couponData.expiryDate || null,
    status: couponData.status || "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await db.collection("coupons").insertOne(newCoupon);
  return newCoupon;
}

export async function updateCoupon(couponId, updates) {
  const db = await getDb();
  await db.collection("coupons").updateOne(
    { $or: [{ couponId }, { code: couponId }] },
    { 
      $set: { 
        ...updates,
        updatedAt: new Date().toISOString()
      } 
    }
  );
  return db.collection("coupons").findOne({ $or: [{ couponId }, { code: couponId }] });
}

export async function deleteCoupon(couponId) {
  const db = await getDb();
  await db.collection("coupons").deleteOne({ $or: [{ couponId }, { code: couponId }] });
  return { success: true };
}

export async function validateCoupon(code, planPrice = 0) {
  const db = await getDb();
  const cleanCode = (code || "").toUpperCase().trim();
  if (!cleanCode) return { valid: false, error: "Please enter a coupon code" };

  const coupon = await db.collection("coupons").findOne({ code: cleanCode });
  if (!coupon) {
    return { valid: false, error: `Invalid coupon code "${cleanCode}"` };
  }

  if (coupon.status !== "active") {
    return { valid: false, error: `Coupon "${cleanCode}" is no longer active` };
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return { valid: false, error: `Coupon "${cleanCode}" has expired` };
  }

  if (coupon.maxUses > 0 && (coupon.usedCount || 0) >= coupon.maxUses) {
    return { valid: false, error: `Coupon usage limit has been reached` };
  }

  const numPrice = Number(planPrice) || 0;
  if (coupon.minAmount && numPrice < coupon.minAmount) {
    return { valid: false, error: `Coupon requires a minimum purchase of ₹${coupon.minAmount}` };
  }

  let discountAmount = 0;
  if (coupon.type === "percentage") {
    discountAmount = Math.round((numPrice * coupon.value) / 100);
  } else {
    discountAmount = Math.min(numPrice, coupon.value);
  }

  const finalPrice = Math.max(0, numPrice - discountAmount);

  return {
    valid: true,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discountAmount,
    finalPrice,
    discountLabel: coupon.type === "percentage" ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`,
    description: coupon.description
  };
}

export async function incrementCouponUsage(code) {
  if (!code) return;
  const db = await getDb();
  const cleanCode = code.toUpperCase().trim();
  await db.collection("coupons").updateOne(
    { code: cleanCode },
    { $inc: { usedCount: 1 } }
  );
}


// ── ACCOUNTS ──

export async function getAccounts(userId) {
  const db = await getDb();
  let accounts = [];
  if (!userId) {
    accounts = await db.collection("accounts").find({}).toArray();
  } else {
    accounts = await db.collection("accounts").find({ userId }).toArray();
    if (accounts.length === 0) {
      const userDoc = await db.collection("users").findOne({ userId });
      const isAdmin = userDoc?.role === "admin" || (userDoc?.email && (userDoc.email.includes("ansari") || userDoc.email.includes("saif")));
      if (isAdmin) {
        accounts = await db.collection("accounts").find({
          $or: [
            { userId: "eb994f0c8e6f7fb4c2629561" },
            { userId: "f4ec583336e491d21d8f7f55" },
            { userId: { $exists: false } }
          ]
        }).toArray();
      }
    }
  }

  // Deduplicate by platform + account name
  const uniqueMap = new Map();
  accounts.forEach(acc => {
    const key = `${acc.platform || ''}:${(acc.name || acc.providerAccountId || '').toLowerCase().trim()}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, acc);
    }
  });

  return Array.from(uniqueMap.values());
}

export async function getAccountById(id) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  return db.collection("accounts").findOne({ _id: new ObjectId(id) });
}

export async function upsertAccount(account) {
  const db = await getDb();

  if (!account.providerAccountId) {
    account.providerAccountId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  const filter = { platform: account.platform, providerAccountId: account.providerAccountId };
  if (account.userId) {
    filter.userId = account.userId;
  }

  await db.collection("accounts").updateOne(
    filter,
    { $set: account },
    { upsert: true }
  );
  return account;
}

export async function removeAccount(id, userId) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  try {
    const filter = { _id: new ObjectId(id) };
    if (userId) filter.userId = userId;
    await db.collection("accounts").deleteOne(filter);
  } catch (e) {
    const filter = { platform: id };
    if (userId) filter.userId = userId;
    await db.collection("accounts").deleteOne(filter);
  }
}

// ── RULES ──

export async function getRules(userId) {
  const db = await getDb();
  if (!userId) return db.collection("rules").find({}).toArray();
  let rules = await db.collection("rules").find({
    $or: [{ user: userId }, { userId: userId }]
  }).toArray();

  if (rules.length === 0) {
    const userDoc = await db.collection("users").findOne({ userId });
    const isAdmin = userDoc?.role === "admin" || (userDoc?.email && (userDoc.email.includes("ansari") || userDoc.email.includes("saif")));
    if (isAdmin) {
      rules = await db.collection("rules").find({}).toArray();
    }
  }
  return rules;
}

export async function getRuleById(id) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  return db.collection("rules").findOne({ _id: new ObjectId(id) });
}

export async function createRule(ruleData) {
  const db = await getDb();
  ruleData.createdAt = new Date().toISOString();
  ruleData.updatedAt = new Date().toISOString();
  if (!ruleData.stats) {
    ruleData.stats = { totalTriggered: 0, totalRepliesSent: 0, totalFailed: 0 };
  }
  const result = await db.collection("rules").insertOne(ruleData);
  return { ...ruleData, _id: result.insertedId };
}

export async function updateRule(id, updates) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  updates.updatedAt = new Date().toISOString();
  await db.collection("rules").updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return getRuleById(id);
}

export async function deleteRule(id) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  await db.collection("rules").deleteOne({ _id: new ObjectId(id) });
}

// ── INBOX & CONVERSATIONS ──

export async function getConversations(userId) {
  const db = await getDb();
  return db.collection("conversations").find(userId ? { userId } : {}).sort({ lastMessageAt: -1 }).toArray();
}

export async function upsertConversation(convData) {
  const db = await getDb();
  const filter = { externalId: convData.externalId }; // Meta thread ID
  
  // If no externalId (e.g. manual creation), insert new
  if (!convData.externalId) {
     convData.createdAt = new Date().toISOString();
     const res = await db.collection("conversations").insertOne(convData);
     return { ...convData, _id: res.insertedId };
  }

  const existing = await db.collection("conversations").findOne(filter);
  if (existing) {
    // Append new messages, update lastMessageAt
    await db.collection("conversations").updateOne(filter, { 
      $set: { 
        lastMessageAt: convData.lastMessageAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      $push: { messages: { $each: convData.messages || [] } }
    });
    return await db.collection("conversations").findOne(filter);
  } else {
    convData.createdAt = new Date().toISOString();
    convData.updatedAt = new Date().toISOString();
    await db.collection("conversations").insertOne(convData);
    return convData;
  }
}

// ── LOGS & WEBHOOKS ──

export async function logWebhookEvent(logData) {
  const db = await getDb();
  logData.receivedAt = new Date().toISOString();
  await db.collection("webhook_logs").insertOne(logData);
}

export async function getPosts(userId) {
  const db = await getDb();
  if (!userId) return db.collection("posts").find({}).sort({ createdAt: -1 }).toArray();
  
  let posts = await db.collection("posts").find({ userId }).sort({ createdAt: -1 }).toArray();
  if (posts.length === 0) {
    const userDoc = await db.collection("users").findOne({ userId });
    const isAdmin = userDoc?.role === "admin" || (userDoc?.email && (userDoc.email.includes("ansari") || userDoc.email.includes("saif")));
    if (isAdmin) {
      posts = await db.collection("posts").find({
        $or: [
          { userId: "eb994f0c8e6f7fb4c2629561" },
          { userId: "f4ec583336e491d21d8f7f55" },
          { userId: { $exists: false } }
        ]
      }).sort({ createdAt: -1 }).toArray();
    }
  }
  return posts;
}

export async function addPost(post) {
  const db = await getDb();
  await db.collection("posts").insertOne(post);
  return post;
}

export async function updatePost(id, updates) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  let filter = { id: id };
  try {
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
    }
  } catch (e) {}

  await db.collection("posts").updateOne(
    filter,
    { $set: updates }
  );
  return db.collection("posts").findOne(filter);
}

export async function deletePost(id, userId) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  let filter = { id: id };
  try {
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
    }
  } catch (e) {}
  if (userId) filter.userId = userId;
  await db.collection("posts").deleteOne(filter);
}

// ── SYSTEM SETTINGS & GLOBAL ANNOUNCEMENTS ──

export async function getSystemSettings() {
  const db = await getDb();
  let settings = await db.collection("system_settings").findOne({ settingKey: "global_config" });
  if (!settings) {
    settings = {
      settingKey: "global_config",
      announcement: {
        enabled: true,
        message: "🎉 Launch Offer: Use coupon WELCOME50 at checkout to get 50% OFF all plans!",
        type: "promo"
      },
      defaultTrialDays: 5,
      autoLockExpired: true,
      maintenanceMode: false,
      updatedAt: new Date().toISOString()
    };
    await db.collection("system_settings").insertOne(settings);
  }
  return settings;
}

export async function updateSystemSettings(updates) {
  const db = await getDb();
  await db.collection("system_settings").updateOne(
    { settingKey: "global_config" },
    { 
      $set: { 
        ...updates, 
        updatedAt: new Date().toISOString() 
      } 
    },
    { upsert: true }
  );
  return db.collection("system_settings").findOne({ settingKey: "global_config" });
}

