# SQL Injection Learning Lab

**Purpose:** A beginner-friendly, *safe* lab to learn what SQL Injection (SQLi) is, how to detect it, and how to fix it. This lab never provides exploit payloads or instructions for attacking third-party systems—it is meant for isolated, local learning.

**Important**: Run this lab only in an isolated environment you control (local machine, VM, or Docker). Do NOT use against systems you do not own or have explicit permission to test. See `LICENSE_NOTE.md`.

---

## Quick start using Docker 

1. From this folder (`sql-injection-lab/`):
```bash
cd sql-injection-lab/docker
docker-compose up --build

2. Open:  http://localhost:8000
Endpoints:

/vulnerable — explanation & illustrative vulnerable pattern (no exploit execution).

/safe/search?q=<username> — safe, parameterized search demonstration.

3. To stop:
docker-compose down

## Quick start using Local (Python virtualenv)

1. Create venv and install:
python3 -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt

2. Initialize DB (created automatically on first run) and run:
cd ../app
python run.py

3. Open http://127.0.0.1:8000

## What is included

app/ — demo apps (vulnerable illustration, and safe implementation).

docker/ — Dockerfile + docker-compose for isolated runs.

exercises/ — conceptual, non-actionable exercises with references.

tracker/ — small JSON schema to track progress locally.

trivia/ — conceptual Q/A reward links (no exploit hints).

tests/ — smoke tests using Flask test client.

## Safety & ethics

NEVER use examples here to attack systems you don't own.

Do not add or accept PRs that include live exploit payloads or instructions for attacking third-party systems.

Prefer defensive content: detection, remediation, logging, monitoring, and safe coding patterns.

## Contributions

Please follow the repo's global CONTRIBUTING guidelines. For this lab, maintainers should ensure:

All code examples remain non-actionable for real attacks.

Exercises link to authoritative learning resources (OWASP, PortSwigger).