import { NextRequest, NextResponse } from 'next/server';
import { generateCSV } from '../../actions/downloadCSV';

export async function POST(request: NextRequest) {
  try {
    const selectedPokemons = await request.json();

    const { content, filename, mimeType } = await generateCSV(selectedPokemons);

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error generating CSV:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSV' },
      { status: 500 }
    );
  }
}
