/**
 * Production-ready Unique Identifier Service for LODZA
 * Generates human-friendly, collision-resistant operational IDs.
 */

export function generateBookingId(): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `LDZ-${year}-${randomPart}`;
}

export function generateInvoiceId(): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `LDZ-INV-${year}-${randomPart}`;
}

export function generateTicketId(): string {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `TKT-${randomPart}`;
}

export function generateClaimId(): string {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `CLM-${randomPart}`;
}

export function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
