import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, cookies }) => {
  console.log('📩 [setRole] Nueva solicitud recibida.')

  // 🛡️ Verificamos Content-Type
  const contentType = request.headers.get('content-type')
  if (contentType !== 'application/json') {
    console.warn('⚠️ [setRole] Content-Type inválido:', contentType)
    return new Response(JSON.stringify({ error: 'Invalid Content-Type' }), {
      status: 400,
    })
  }

  let data: any = {}
  try {
    data = await request.json()
    console.log('✅ [setRole] JSON recibido:', data)
  } catch (err) {
    console.error('❌ [setRole] Error parseando JSON:', err)
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
    })
  }

  const { role } = data

  if (!role) {
    console.warn('⚠️ [setRole] Role no proporcionado en la solicitud.')
    return new Response(JSON.stringify({ error: 'Role is required' }), {
      status: 400,
    })
  }

  // 🥐 Establecemos la cookie
  cookies.set('userRole', role, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
  })

  console.log(`✅ [setRole] Cookie "userRole" seteada como: "${role}"`)

  return new Response(
    JSON.stringify({ message: 'Rol actualizado correctamente.' }),
    { status: 200 }
  )
}
