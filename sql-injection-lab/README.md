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


---

## SQL Injection Learning Lab (safe & interactive)

> A beginner-friendly, **isolated** sandbox that teaches SQL Injection *concepts*, detection, and mitigation — without providing exploit payloads or instructions for attacking live systems.

### What learners will get
- Short conceptual exercises covering SQLi types and detection.
- A tiny demo app showing an **illustrative** vulnerable pattern (non-executable) and a **safe** implementation using parameterized queries.
- A local progress tracker (JSON) + small trivia rewards linking to further reading.
- Docker support so learners can run the lab in an isolated container.

### Why this is useful
- Hands-on, practical learning focused on **defense** and secure coding.
- Designed to be safe for classrooms, workshops, and self-study when run locally.

### Demo 
Index (lab started successfully):
![Lab index screenshot](sql-injection-lab/assets/screenshots/index.png)

Safe search example (`/safe/search?q=alice`) showing seeded results:
![Safe search result](sql-injection-lab/assets/screenshots/safe_search_alice.png)

> Screenshots contain only benign output (no payloads, no sensitive data).

### Quick start — run locally (Python venv)
```bash
# from repo root
cd sql-injection-lab
python -m venv venv
# Windows (PowerShell)
.\venv\Scripts\Activate.ps1
# Unix
# source venv/bin/activate
pip install -r requirements.txt

# run the lab
python -m app.run

# open in browser:
# http://127.0.0.1:8000/

## Quick start using Docker
cd sql-injection-lab/docker
docker-compose up --build
# then open http://localhost:8000/

## Endpoints to try

/ → index (lab info & endpoints)
/exercises/01-intro.md → conceptual lesson
/safe/search?q=<username> → safe parameterized query demo (seeded users: alice, bob, charlie)
/vulnerable/ → illustrative vulnerable pattern (non-executable demonstration)
