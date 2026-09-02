# Security Policy

## Supported Versions

MobileSQL is currently in active stabilization and maintainer review. Security patches are applied to the active development branch (`main`) and release candidate versions.

| Version | Status | Security Support |
|---|---|---|
| `1.0.x` (current branch) | Release Candidate / Active | :white_check_mark: Supported |
| `< 1.0.0` | Development Previews | :x: Not supported |

---

## Reporting a Vulnerability

We appreciate the efforts of security researchers and community members in helping maintain the safety and integrity of MobileSQL.

If you believe you have found a security vulnerability in MobileSQL, please report it **privately and responsibly**.

### Reporting Channels
* **GitHub Private Vulnerability Reporting**: Submit a private advisory via the repository's **Security** tab (`Security > Advisories > Report a vulnerability`).
* **Direct Maintainer Contact**: If GitHub Private Vulnerability Reporting is unavailable, contact the project stakeholders / lead maintainers privately.
* *(Note: Dedicated project security mailboxes, such as `security@...`, are pending formal domain provisioning by project stakeholders).*

---

## Information to Include in a Report

To help us triage and resolve the issue quickly, please include:
1. **Vulnerability Type**: A description of the issue (e.g., SQL Injection, Broken Authentication, Cross-Site Scripting, Insecure Direct Object Reference).
2. **Affected Components**: Specific endpoints, controllers, UI components, or configuration files involved.
3. **Step-by-Step Reproduction**: Detailed reproduction steps or a minimal Proof of Concept (PoC).
4. **Impact Assessment**: The potential severity, affected data, or attack vector.
5. **Proposed Remediation**: (Optional) Suggested code fixes or configuration mitigations.

---

## What NOT to Publicly Disclose

To protect users and running deployments, **DO NOT**:
* Open public GitHub Issues or Pull Requests containing vulnerability details, exploits, or reproduction payloads.
* Discuss unpatched security vulnerabilities in public chats, discussions, or social media.
* Post live credentials, private API keys, database tokens, or production data.

---

## Response Timeline & Disclosure Policy

* **Acknowledgement**: We aim to acknowledge receipt of private vulnerability reports within 48 hours.
* **Triage & Assessment**: The issue will be investigated, validated, and assigned a severity rating.
* **Patch & Coordinated Disclosure**: Once a fix is verified and merged to `main`, release notes or an advisory will be published with credit given to the reporter (unless anonymity is requested).

