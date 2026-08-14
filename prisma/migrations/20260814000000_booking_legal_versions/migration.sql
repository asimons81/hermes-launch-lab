ALTER TABLE "Booking"
  ADD COLUMN "purchaseCountry" TEXT NOT NULL DEFAULT 'US',
  ADD COLUMN "acceptedPrivacyVersion" TEXT,
  ADD COLUMN "acceptedRefundVersion" TEXT,
  ADD COLUMN "acceptedConsultingVersion" TEXT;
