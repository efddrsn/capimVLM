"""Utilities for interacting with the Gemini Nano-Banana image model (stubbed)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter


class ImageGenerationError(RuntimeError):
    """Raised when the enhancement pipeline fails."""


def generate_corrected_image(
    image_path: Path, instructions: str, output_path: Path
) -> Path:
    """Produce an "enhanced" version of the input image.

    The real system should send the prompt and image to the Gemini Nano-Banana
    API. Here we approximate the effect by sharpening and whitening the teeth via
    simple Pillow filters so the UI can display an illustrative before/after.
    """

    try:
        image = Image.open(image_path).convert("RGB")
    except FileNotFoundError as exc:
        raise ImageGenerationError("Imagem original não encontrada para processamento.") from exc

    brightness = ImageEnhance.Brightness(image).enhance(1.15)
    contrast = ImageEnhance.Contrast(brightness).enhance(1.1)
    sharpened = contrast.filter(ImageFilter.DETAIL)
    saturated = ImageEnhance.Color(sharpened).enhance(1.2)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    saturated.save(output_path)
    return output_path
