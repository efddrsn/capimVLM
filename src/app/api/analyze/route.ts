import { NextResponse } from 'next/server';
import { getGeminiClient, MODELS } from '@/lib/gemini';
import { ANALYSIS_PROMPT_SINGLE, getMultiImageAnalysisPrompt } from '@/lib/prompts';

interface ImageInput {
  stepId: string;
  image: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const client = getGeminiClient();

    // Support both single image (legacy) and multi-image
    const images: ImageInput[] = body.images || (body.image ? [{ stepId: 'frente', image: body.image }] : []);

    if (images.length === 0) {
      return NextResponse.json({ error: 'Nenhuma imagem fornecida' }, { status: 400 });
    }

    const isMulti = images.length > 1;
    const prompt = isMulti
      ? getMultiImageAnalysisPrompt(images.map((img) => img.stepId))
      : ANALYSIS_PROMPT_SINGLE;

    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
      { text: prompt },
    ];

    for (const img of images) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: img.image,
        },
      });
    }

    const response = await client.models.generateContent({
      model: MODELS.vision,
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
    });

    const text = response.text ?? '';

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Não foi possível processar a análise. Tente novamente.' },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);

    // Ensure required fields exist with defaults
    return NextResponse.json({
      condicoes_identificadas: result.condicoes_identificadas || [],
      saude_geral_visivel: result.saude_geral_visivel || 'atenção',
      score_saude: result.score_saude ?? 5,
      observacoes_positivas: result.observacoes_positivas || [],
      limitacoes_da_analise: result.limitacoes_da_analise || [],
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Erro ao analisar imagem' },
      { status: 500 }
    );
  }
}
