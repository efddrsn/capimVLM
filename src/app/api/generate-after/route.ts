import { NextResponse } from 'next/server';
import { getGeminiClient, MODELS } from '@/lib/gemini';
import { getBeforeAfterPrompt } from '@/lib/prompts';

export async function POST(request: Request) {
  try {
    const { image, conditions } = await request.json();

    if (!image || !conditions?.length) {
      return NextResponse.json({ error: 'Imagem e condições são obrigatórias' }, { status: 400 });
    }

    const client = getGeminiClient();
    const prompt = getBeforeAfterPrompt(conditions);

    const response = await client.models.generateContent({
      model: MODELS.imageGeneration,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: image,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    // Extract generated image from response
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      return NextResponse.json({ error: 'Nenhuma imagem gerada' }, { status: 500 });
    }

    for (const part of parts) {
      if (part.inlineData?.data) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        const afterImage = `data:${mimeType};base64,${part.inlineData.data}`;
        return NextResponse.json({ afterImage });
      }
    }

    return NextResponse.json({ error: 'Imagem não encontrada na resposta' }, { status: 500 });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar imagem antes/depois' },
      { status: 500 }
    );
  }
}
