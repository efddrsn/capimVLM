from __future__ import annotations

import os
import secrets
from pathlib import Path

from flask import (
    Flask,
    flash,
    redirect,
    render_template,
    request,
    url_for,
)

from .services.gemini import ImageGenerationError, generate_corrected_image
from .services.vision import format_timestamp, run_analysis, structure_response
from .utils.storage import load_prompts, load_state, save_prompts, save_state

BASE_DIR = Path(__file__).resolve().parent
UPLOADS_DIR = BASE_DIR / "static" / "uploads"
ENHANCED_DIR = BASE_DIR / "static" / "enhanced"

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY", secrets.token_hex(16))


def create_app() -> Flask:
    """Factory used by WSGI servers and external tooling."""
    return app


@app.context_processor
def inject_globals():
    return {"app_title": "Avaliação Odontológica Assistida"}


@app.route("/")
def index():
    state = load_state()
    structured = state.get("structured_findings")
    original_image = state.get("original_image")
    corrected_image = state.get("corrected_image")
    return render_template(
        "index.html",
        structured=structured,
        original_image=original_image,
        corrected_image=corrected_image,
    )


@app.route("/upload", methods=["POST"])
def handle_upload():
    file = request.files.get("smile_photo")
    if not file:
        flash("Envie uma imagem antes de processar.", "error")
        return redirect(url_for("index"))

    filename = f"{secrets.token_hex(8)}_{file.filename}"
    upload_path = UPLOADS_DIR / filename
    upload_path.parent.mkdir(parents=True, exist_ok=True)
    file.save(upload_path)

    prompts = load_prompts()
    analysis_prompt = prompts.get("analysis_prompt", "")
    enhancement_prompt = prompts.get("enhancement_prompt", "")

    raw_response = run_analysis(upload_path, analysis_prompt)
    structured = structure_response(raw_response)

    enhanced_filename = f"enhanced_{filename}"
    enhanced_path = ENHANCED_DIR / enhanced_filename
    try:
        generate_corrected_image(upload_path, enhancement_prompt, enhanced_path)
    except ImageGenerationError as error:
        flash(str(error), "error")
        enhanced_filename = None

    state = {
        "last_raw_response": raw_response,
        "structured_findings": structured,
        "original_image": f"uploads/{filename}",
        "corrected_image": f"enhanced/{enhanced_filename}" if enhanced_filename else None,
        "updated_at": format_timestamp(),
    }
    save_state(state)

    flash("Avaliação concluída com sucesso!", "success")
    return redirect(url_for("index"))


@app.route("/backend", methods=["GET"])
def backend_panel():
    prompts = load_prompts()
    state = load_state()
    return render_template(
        "backend.html",
        prompts=prompts,
        raw_response=state.get("last_raw_response"),
        structured=state.get("structured_findings"),
        updated_at=state.get("updated_at"),
    )


@app.route("/backend/prompts", methods=["POST"])
def update_prompts():
    analysis_prompt = request.form.get("analysis_prompt", "").strip()
    enhancement_prompt = request.form.get("enhancement_prompt", "").strip()

    prompts = {
        "analysis_prompt": analysis_prompt,
        "enhancement_prompt": enhancement_prompt,
        "updated_at": format_timestamp(),
    }
    save_prompts(prompts)

    flash("Prompts atualizados.", "success")
    return redirect(url_for("backend_panel"))


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
