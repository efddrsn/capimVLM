import json
from pathlib import Path
from typing import Any, Dict

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
PROMPTS_FILE = DATA_DIR / "prompts.json"
STATE_FILE = DATA_DIR / "state.json"


def read_json(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as handler:
        return json.load(handler)


def write_json(path: Path, content: Dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handler:
        json.dump(content, handler, indent=2, ensure_ascii=False)


def load_prompts() -> Dict[str, Any]:
    defaults = {
        "analysis_prompt": "",
        "enhancement_prompt": "",
        "updated_at": None,
    }
    data = read_json(PROMPTS_FILE)
    return {**defaults, **data}


def save_prompts(prompts: Dict[str, Any]) -> None:
    write_json(PROMPTS_FILE, prompts)


def load_state() -> Dict[str, Any]:
    defaults = {
        "last_raw_response": None,
        "structured_findings": None,
        "original_image": None,
        "corrected_image": None,
        "updated_at": None,
    }
    data = read_json(STATE_FILE)
    return {**defaults, **data}


def save_state(state: Dict[str, Any]) -> None:
    write_json(STATE_FILE, state)
