/**
 * Client-side image quality checks using Canvas API.
 * These run on video frames before capture to guide the user.
 */

export interface QualityCheckResult {
  brightness: { passed: boolean; value: number };
  focus: { passed: boolean; value: number };
  proximity: { passed: boolean; value: number };
}

const BRIGHTNESS_MIN = 60;
const BRIGHTNESS_MAX = 220;
const FOCUS_THRESHOLD = 50;
const PROXIMITY_THRESHOLD = 30;

/**
 * Analyze brightness by computing average luminance of sampled pixels.
 */
export function checkBrightness(imageData: ImageData): { passed: boolean; value: number } {
  const data = imageData.data;
  let totalLuminance = 0;
  const sampleStep = 4; // sample every 4th pixel for performance
  let count = 0;

  for (let i = 0; i < data.length; i += 4 * sampleStep) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b;
    count++;
  }

  const avgLuminance = totalLuminance / count;
  return {
    passed: avgLuminance >= BRIGHTNESS_MIN && avgLuminance <= BRIGHTNESS_MAX,
    value: Math.round(avgLuminance),
  };
}

/**
 * Estimate focus using Laplacian variance.
 * Higher variance = sharper image.
 */
export function checkFocus(imageData: ImageData, width: number, height: number): { passed: boolean; value: number } {
  const gray = new Float32Array(width * height);
  const data = imageData.data;

  // Convert to grayscale
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  }

  // Apply Laplacian kernel [0,1,0; 1,-4,1; 0,1,0]
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      const idx = y * width + x;
      const laplacian =
        gray[idx - width] +
        gray[idx - 1] +
        gray[idx + 1] +
        gray[idx + width] -
        4 * gray[idx];

      sum += laplacian;
      sumSq += laplacian * laplacian;
      count++;
    }
  }

  const mean = sum / count;
  const variance = sumSq / count - mean * mean;
  const normalizedVariance = Math.min(100, variance / 10);

  return {
    passed: normalizedVariance >= FOCUS_THRESHOLD,
    value: Math.round(normalizedVariance),
  };
}

/**
 * Check if the center region of the image has enough detail (proxy for proximity).
 * Looks at color variance in the center ROI.
 */
export function checkProximity(imageData: ImageData, width: number, height: number): { passed: boolean; value: number } {
  const data = imageData.data;
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  const roiSize = Math.floor(Math.min(width, height) * 0.4);

  let rSum = 0, gSum = 0, bSum = 0;
  let rSumSq = 0, gSumSq = 0, bSumSq = 0;
  let count = 0;

  const startX = centerX - Math.floor(roiSize / 2);
  const startY = centerY - Math.floor(roiSize / 2);

  for (let y = startY; y < startY + roiSize; y += 2) {
    for (let x = startX; x < startX + roiSize; x += 2) {
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      rSum += r; gSum += g; bSum += b;
      rSumSq += r * r; gSumSq += g * g; bSumSq += b * b;
      count++;
    }
  }

  if (count === 0) return { passed: false, value: 0 };

  const rVar = rSumSq / count - (rSum / count) ** 2;
  const gVar = gSumSq / count - (gSum / count) ** 2;
  const bVar = bSumSq / count - (bSum / count) ** 2;
  const avgVar = (rVar + gVar + bVar) / 3;
  const normalizedVar = Math.min(100, avgVar / 20);

  return {
    passed: normalizedVar >= PROXIMITY_THRESHOLD,
    value: Math.round(normalizedVar),
  };
}

/**
 * Run all quality checks on a canvas frame.
 */
export function runAllChecks(canvas: HTMLCanvasElement): QualityCheckResult {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return {
      brightness: { passed: false, value: 0 },
      focus: { passed: false, value: 0 },
      proximity: { passed: false, value: 0 },
    };
  }

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);

  return {
    brightness: checkBrightness(imageData),
    focus: checkFocus(imageData, width, height),
    proximity: checkProximity(imageData, width, height),
  };
}

/**
 * Convert a canvas to a base64 JPEG string (without the data:image/jpeg;base64, prefix).
 */
export function canvasToBase64(canvas: HTMLCanvasElement, quality = 0.85): string {
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  return dataUrl.split(',')[1];
}

/**
 * Convert a File to base64 string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
