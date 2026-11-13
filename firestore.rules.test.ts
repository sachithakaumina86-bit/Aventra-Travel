/**
 * Verification harness documenting the "Dirty Dozen" security assertions
 * for AVENTRA Firestore security rules (compatible with @firebase/rules-unit-testing).
 */
export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  expected: 'PERMISSION_DENIED';
  description: string;
}

export const DIRTY_DOZEN_CASES: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Unverified Admin Email Spoof',
    collection: 'bookings',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
    description: 'email == sachithakaumina86@gmail.com with email_verified == false must be denied',
  },
  {
    id: 2,
    name: 'Self-Admin Privilege Escalation',
    collection: 'admins',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    description: 'Non-admin authenticated user cannot write to /admins/{uid}',
  },
  {
    id: 3,
    name: 'Draft Destination Scraping',
    collection: 'destinations',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
    description: 'Public user cannot get destination where isPublished == false',
  },
  {
    id: 4,
    name: 'Shadow Field Injection on Public Inquiry',
    collection: 'inquiries',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    description: 'Inquiry containing undeclared field or status != pending must fail hasOnly/status check',
  },
  {
    id: 5,
    name: 'Timestamp Spoofing on Inquiry',
    collection: 'inquiries',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    description: 'createdAt != request.time must be rejected',
  },
  {
    id: 6,
    name: 'ID Poisoning on Contact Message',
    collection: 'contactMessages',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    description: 'Document ID exceeding 128 chars or failing ^[a-zA-Z0-9_-]+$ must be denied',
  },
  {
    id: 7,
    name: 'PII List Leak on Customers',
    collection: 'customers',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
    description: 'Signed-in non-admin cannot list /customers',
  },
  {
    id: 8,
    name: 'Payload Size Exhaustion on Contact Message',
    collection: 'contactMessages',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    description: 'Message length > 3000 chars must be rejected',
  },
  {
    id: 9,
    name: 'Inquiry Status Escalation by Non-Admin',
    collection: 'inquiries',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    description: 'Non-admin cannot update an inquiry status',
  },
  {
    id: 10,
    name: 'Unauthorized Catalog Creation',
    collection: 'tourPackages',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    description: 'Signed-in non-admin cannot create a tour package',
  },
  {
    id: 11,
    name: 'Direct Booking Creation by Public User',
    collection: 'bookings',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    description: 'Only verified admin can create bookings',
  },
  {
    id: 12,
    name: 'Website Settings Overwrite by Non-Admin',
    collection: 'websiteSettings',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    description: 'Only verified admin can modify websiteSettings/public',
  },
];
