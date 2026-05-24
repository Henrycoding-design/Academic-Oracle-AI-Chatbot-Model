# Security Policy

Contact: tanbinhvo.hcm@gmail.com

At Academic Oracle, we take the security of our systems and users seriously. Despite continuous efforts to improve security, vulnerabilities may still exist.

If you discover a security vulnerability, we ask that you report it responsibly so it can be investigated and addressed as quickly as possible.

Please do not publicly disclose security issues until they have been reviewed and resolved.

---

## Supported Versions

The latest version of Academic Oracle is currently supported with security updates.

---

## Reporting a Vulnerability

Please report vulnerabilities privately through one of the following channels:

- Email: tanbinhvo.hcm@gmail.com
- GitHub private vulnerability reporting (if enabled)

Please include as much information as possible:

- Description of the issue
- Steps to reproduce
- Potential impact
- Proof of concept or screenshots if applicable

Reports that contain clear reproduction steps and impact analysis are significantly easier to investigate and resolve.

---

## Out of Scope

The following are generally considered out of scope unless a significant security impact can be demonstrated:

- Clickjacking on non-sensitive pages
- Missing security headers without a demonstrated exploit path
- User enumeration without sensitive impact
- Rate limiting suggestions
- Self-XSS
- Content spoofing or text injection without privilege escalation
- Attacks requiring physical access to a user device
- Social engineering attacks
- Denial of Service (DoS/DDoS) attacks
- Vulnerabilities affecting only outdated or unsupported versions
- Reports from automated vulnerability scanners without a valid proof of exploitability

---

## Testing Guidelines

When performing security research against Academic Oracle systems:

- Do not intentionally disrupt services or infrastructure
- Do not access, modify, or delete data belonging to other users
- Do not perform destructive testing
- Do not attempt privilege escalation beyond what is necessary to demonstrate impact
- Do not publicly disclose vulnerabilities before resolution
- Only test against systems owned or officially operated by Academic Oracle

If you are unsure whether a test is acceptable, contact us before proceeding.

---

## Disclosure Guidelines

To help protect users and infrastructure:

- Please allow reasonable time for investigation and remediation before public disclosure
- Do not publish exploit details, proof-of-concepts, or sensitive information before a fix is available
- Coordinated disclosure is strongly preferred

If you wish to publish research related to Academic Oracle after resolution, please contact us in advance.

---

## What You Can Expect From Us

When a valid report is submitted, Academic Oracle will make reasonable efforts to:

- Acknowledge receipt of the report
- Investigate and validate the issue
- Keep reporters informed during remediation
- Resolve confirmed vulnerabilities in a reasonable timeframe
- Credit responsible disclosure where appropriate

We appreciate responsible security research and efforts that help improve the safety and reliability of Academic Oracle.