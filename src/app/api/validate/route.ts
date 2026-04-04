import { NextResponse } from 'next/server';
import { getGeminiClient, MODELS } from '@/lib/gemini';
import { VALIDATION_PROMPT } from '@/lib/prompts';

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Imagem não fornecida' }, { status: 400 });
    }

    const client = getGeminiClient();

    const response = await client.models.generateContent({
      model: MODELS.vision,
      contents: [
        {
          role: 'user',
          parts: [
            { text: VALIDATION_PROMPT },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: image,
              },
            },
          ],
        },
      ],
    });

    const text = response.text ?? '';

    // Parse JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({
        isValid: false,
        qualityScore: 0,
        feedback: 'Não foi possível analisar a imagem. Tente novamente.',
        isOralCavity: false,
      });
    }

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      isValid: result.isOralCavity && result.qualityScore >= 60,
      qualityScore: result.qualityScore,
      feedback: result.feedback,
      isOralCavity: result.isOralCavity,
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Erro ao validar imagem' },
      { status: 500 }
    );
  }
}
