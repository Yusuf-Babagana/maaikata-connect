import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@example.com',
    password: 'securepassword123',
    email_confirm: true,
  })

  if (error) {
    console.error('Error creating admin:', error)
  } else {
    await supabase.from('users').insert({
      id: data.user.id,
      email: 'admin@example.com',
      role: 'ADMIN',
      firstName: 'Super',
      lastName: 'Admin',
    })
    console.log('Admin created:', data.user.id)
  }
}

seedAdmin()
