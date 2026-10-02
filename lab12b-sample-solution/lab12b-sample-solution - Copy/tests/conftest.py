# tests/conftest.py — ทำให้ pytest หาโค้ดใน src/ เจอ
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))