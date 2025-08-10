export async function POST(request) {
  try {
    const body = await request.json();
    const { game, userId, serverId } = body;

    if (!game || !userId || !serverId) {
      return Response.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Make the request to the external API
    const response = await fetch(
      `https://gamesapi.oneapi.in/api.php?game=${game}&user_id=${userId}&other_id=${serverId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return Response.json(data);
  } catch (error) {
    console.error('Validation API error:', error);
    return Response.json(
      { error: 'Validation failed', details: error.message },
      { status: 500 }
    );
  }
}
