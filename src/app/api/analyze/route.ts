import { NextResponse } from 'next/server';
import { getGeminiClient, MODELS } from '@/lib/gemini';
import { ANALYSIS_PROMPT } from '@/lib/prompts';

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
            { text: ANALYSIS_PROMPT },
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
