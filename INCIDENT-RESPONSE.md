# Incident response checklist

1. Contain: disable the affected integration, route, credential, or deployment without deleting evidence.
2. Preserve: record timestamps, affected booking IDs, provider event IDs, and sanitized error details. Never paste secrets or full payment payloads into tickets or logs.
3. Assess: determine whether authentication, booking ownership, intake data, payment state, email delivery, or remote-session information was exposed or altered.
4. Rotate: revoke affected credentials, sessions, webhook secrets, and admin access using least-privilege replacements.
5. Recover: restore from a known-good deployment or encrypted backup and verify the complete booking-to-confirmation path.
6. Notify: contact affected clients and providers when appropriate, using verified facts and required legal timelines.
7. Review: document root cause, detection gap, corrective action, owner, and due date.

Production launch requires MFA on Vercel, Neon, Stripe, Resend, the authentication provider, Google, GitHub, and the domain/DNS provider; encrypted database backups; a tested restore; separate admin accounts; webhook and email failure alerts; and current secret-rotation records.
