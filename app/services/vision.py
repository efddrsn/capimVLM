"""Utilities for interacting with the OpenAI Vision API (stubbed)."""

from __future__ import annotations

import datetime as dt
import random
from pathlib import Path
from typing import Dict, List


def run_analysis(image_path: Path, instructions: str) -> str:
    """Simulate sending the image to the OpenAI Vision API.

    In production this function should call the real API. Here we return a
    deterministic but varied message so the UI can be exercised offline.
    """

    issues = [
        "cárie incipiente no molar superior esquerdo",
        "placa bacteriana nas gengivas inferiores",
        "desalinhamento leve dos incisivos centrais",
        "desgaste no canino inferior direito",
    ]
    severities = ["leve", "moderada"]

    random.seed(image_path.name)
    picked = random.sample(issues, k=3)

    lines = [
        "Relatório de avaliação odontológica automatizada:",
        f"Instruções aplicadas: {instructions.strip()[:120]}...",
    ]
    for item in picked:
        severity = random.choice(severities)
        recommendation = {
            "leve": "Recomenda acompanhamento preventivo e profilaxia profissional.",
            "moderada": "Indica avaliação clínica presencial e possível intervenção restauradora.",
        }[severity]
        lines.append(f"- Problema: {item} | Gravidade: {severity}. {recommendation}")

    lines.append(
        "Recomendações gerais: reforçar higiene bucal, fio dental diário e acompanhamento com dentista de confiança."
    )
    return "\n".join(lines)


def structure_response(raw_response: str) -> Dict[str, List[Dict[str, str]]]:
    """Convert the raw model response into a structured JSON-friendly dict."""

    findings: List[Dict[str, str]] = []
    for line in raw_response.splitlines():
        if line.strip().startswith("- Problema:"):
            try:
                header, recommendation = line.split(".", 1)
            except ValueError:
                header, recommendation = line, ""
            parts = header.split("|")
            problem = parts[0].split(":", 1)[1].strip()
            severity = parts[1].split(":", 1)[1].strip() if len(parts) > 1 else ""
            findings.append(
                {
                    "issue": problem,
                    "severity": severity,
                    "recommendation": recommendation.strip(),
                }
            )
    summary = raw_response.splitlines()[-1] if raw_response else ""
    return {"findings": findings, "summary": summary}


def format_timestamp() -> str:
    return dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
