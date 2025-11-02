import { NextRequest, NextResponse } from 'next/server'
import { findOrder } from '@/lib/database'
import jwt from 'jsonwebtoken'
import { put, head } from '@vercel/blob'

interface JWTPayload {
  orderId: string
  customerEmail: string
  exp: number
  iat: number
}

function generateDownloadToken(orderId: string, customerEmail: string): string {
  const payload = {
    orderId,
    customerEmail,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    iat: Math.floor(Date.now() / 1000)
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET!)
}

function verifyDownloadToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')
  const token = searchParams.get('token')
  const action = searchParams.get('action') || 'download'

  try {
    // If no token provided, generate one for valid order
    if (!token && orderId) {
      const orderResult = await findOrder({ id: orderId })
      
      if (!orderResult.success) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      const order = orderResult.order

      // Check if order is completed and not expired
      if (order.status !== 'completed') {
        return NextResponse.json({ error: 'Order not completed' }, { status: 400 })
      }

      if (order.expiresAt && new Date(order.expiresAt) < new Date()) {
        return NextResponse.json({ error: 'Download link expired' }, { status: 410 })
      }

      // Generate download token
      const downloadToken = generateDownloadToken(orderId, order.customerEmail)
      
      return NextResponse.json({
        success: true,
        downloadToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        downloadUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/download?token=${downloadToken}&action=download`
      })
    }

    // Verify token
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 })
    }

    const payload = verifyDownloadToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    // Find order
    const orderResult = await findOrder({ id: payload.orderId })
    if (!orderResult.success) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orderResult.order

    // Verify customer email matches
    if (order.customerEmail !== payload.customerEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check order status and expiry
    if (order.status !== 'completed') {
      return NextResponse.json({ error: 'Order not completed' }, { status: 400 })
    }

    if (order.expiresAt && new Date(order.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Download link expired' }, { status: 410 })
    }

    // Handle different actions
    if (action === 'info') {
      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          productName: order.productName,
          amount: order.amount,
          currency: order.currency,
          status: order.status,
          paidAt: order.paidAt,
          expiresAt: order.expiresAt
        }
      })
    }

    if (action === 'download') {
      // For now, return a presigned URL or file info
      // In a real implementation, you would:
      // 1. Get the file from Vercel Blob storage
      // 2. Stream it to the user
      // 3. Track download count/limits
      
      try {
        // Example: Get file from Vercel Blob
        const blobUrl = `https://blob.vercel-storage.com/products/${order.productId}`
        
        // Check if file exists
        try {
          await head(blobUrl)
        } catch (error) {
          console.error('File not found in blob storage:', error)
          return NextResponse.json({ error: 'File not available' }, { status: 404 })
        }

        // For security, don't expose direct blob URL
        // Instead, proxy the download through this endpoint
        const response = await fetch(blobUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch file')
        }

        const fileBuffer = await response.arrayBuffer()
        const fileName = `${order.productName.replace(/[^a-zA-Z0-9]/g, '_')}_${order.orderNumber}.zip`

        // Track download (optional)
        // await trackDownload(order.id, payload.customerEmail)

        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })

      } catch (error) {
        console.error('Download error:', error)
        
        // Fallback: return download instructions
        return NextResponse.json({
          success: true,
          message: 'Download ready',
          instructions: 'Your purchase is ready for download. Please contact support if you need assistance.',
          order: {
            orderNumber: order.orderNumber,
            productName: order.productName,
            purchaseDate: order.paidAt
          }
        })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Download API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Handle file upload for products (admin only)
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string
    const adminToken = formData.get('adminToken') as string

    // Verify admin token (implement your admin auth logic)
    if (!adminToken || adminToken !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!file || !productId) {
      return NextResponse.json({ error: 'File and productId required' }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`products/${productId}/${file.name}`, file, {
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      productId,
      fileName: file.name,
      size: file.size
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

