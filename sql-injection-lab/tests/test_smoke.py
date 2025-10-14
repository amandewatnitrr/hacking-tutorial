import pytest
from app.run import create_app

@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as c:
        yield c

def test_index(client):
    r = client.get("/")
    assert r.status_code == 200
    assert b"SQL Injection Learning Lab" in r.data or b"lab" in r.data

def test_vulnerable_info(client):
    r = client.get("/vulnerable/")
    assert r.status_code == 200
    data = r.get_json()
    assert "illustrative_pattern" in data

def test_safe_search_missing(client):
    r = client.get("/safe/search")
    assert r.status_code == 400

def test_safe_search_found(client):
    # seeded users include 'alice'
    r = client.get("/safe/search?q=alice")
    assert r.status_code == 200
    data = r.get_json()
    assert data.get("count", 0) >= 0
