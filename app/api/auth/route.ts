import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateToken, isValidEmail, sanitizeUser, hashPassword, isValidPassword } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'login') {
    return handleLogin(request)
  } else if (action === 'register') {
    return handleRegister(request)
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }
}

async function handleLogin(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 })
    }

    const { db } = await connectDB()
    const user = await db.collection('users').findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 })
    }

    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 })
    }

    const token = generateToken(user._id.toString())
    const sanitizedUser = sanitizeUser(user)

    return NextResponse.json({
      success: true,
      user: sanitizedUser,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

async function handleRegister(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Name, email, and password are required'
      }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 })
    }

    if (!isValidPassword(password)) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 8 characters long'
      }, { status: 400 })
    }

    const { db } = await connectDB()
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User already exists'
      }, { status: 409 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await db.collection('users').insertOne(newUser)
    const token = generateToken(result.insertedId.toString())
    const sanitizedUser = sanitizeUser({ ...newUser, _id: result.insertedId })

    return NextResponse.json({
      success: true,
      user: sanitizedUser,
      token
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 })
}

