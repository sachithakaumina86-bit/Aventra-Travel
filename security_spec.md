# AVENTRA Security Specification (Phase 0)

## 1. Data Invariants
1. **Default-Deny Baseline**: Every unspecified document path defaults to `allow read, write: if false`.
2. **Verified Admin Boundary**: Administrative privileges are exclusively granted to authenticated users with `email_verified == true` whose email matches the bootstrapped primary owner (`sachithakaumina86@gmail.com`) OR whose `uid` exists in `/admins/{uid}`. No client user can self-register into `/admins/{uid}`.
3. **Catalog Publication Isolation**: Public visitors may only `get` or `list` documents in `destinations`, `experiences`, `tourPackages`, `testimonials`, `blogPosts`, and `gallery` when `resource.data.isPublished == true`. Drafts remain invisible to non-admins.
4. **Settings Separation**: Public readers can only `get` `/websiteSettings/public`; listing or writing `websiteSettings` is Admin-only.
5. **PII Protection**: `inquiries`, `bookings`, `customers`, `contactMessages`, and `admins` contain traveler PII. Public/non-admin `read`, `list`, `update`, and `delete` are strictly denied.
6. **Public Form Integrity & Non-Escalation**: Unauthenticated visitors submitting `/plan-your-journey` (`inquiries`) or `/contact` (`contactMessages`) may ONLY `create` documents with:
   - Exact schema key allowlists (`hasAll` + `hasOnly`)
   - Forced initial status (`status == 'pending'` for inquiries; `status == 'unread'` for contactMessages)
   - Server timestamp enforcement (`createdAt == request.time && updatedAt == request.time`)
   - Bounded string lengths and positive integer traveler counts
   - No `convertedBookingId` or confirmation escalation on creation.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unverified Admin Email Spoof**: User with `email: "sachithakaumina86@gmail.com"`, `email_verified: false` tries to read `/bookings` -> DENIED.
2. **Self-Admin Privilege Escalation**: Signed-in non-admin writes `/admins/{theirUid}` with `role: "super_admin"` -> DENIED.
3. **Draft Catalog Scraping**: Unauthenticated user queries `/destinations` without `where("isPublished", "==", true)` -> DENIED.
4. **Shadow Field Injection on Public Inquiry**: Visitor posts to `/inquiries/{id}` with extra field `status: "confirmed"` or `isVipApproved: true` -> DENIED.
5. **Backdated Timestamp Spoof**: Visitor posts to `/inquiries/{id}` with client-supplied `createdAt` different from `request.time` -> DENIED.
6. **ID Poisoning / Denial of Wallet**: Visitor posts to `/inquiries/{longInvalidId}` (>128 chars or special characters) -> DENIED.
7. **PII Read Leak on Inquiries/Bookings**: Signed-in non-admin calls `get` or `list` on `/inquiries` or `/bookings` -> DENIED.
8. **1MB Payload Exhaustion on Contact Message**: Visitor submits 100KB string in `contactMessages.message` -> DENIED (`size() <= 3000`).
9. **Unauthorized Update on Public Inquiry**: Original visitor or random user attempts to `update` `/inquiries/{id}` to change `status` to `"converted"` -> DENIED.
10. **Slug Regex Poisoning by Rogue Non-Admin**: Non-admin tries to create `/destinations/sigiriya` -> DENIED.
11. **Direct Booking Creation Bypass**: Public visitor tries to create a confirmed booking directly in `/bookings/{id}` -> DENIED.
12. **Settings Overwrite Attack**: Non-admin attempts to update `/websiteSettings/public` contact email -> DENIED.
