import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const blob = file as Blob
    const size = blob.size
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (>5MB)' }, { status: 413 })
    }
    // basic mime check - Cloudinary will also validate
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mime = (blob as any).type || ''
    if (!/^image\//i.test(mime)) {
      return NextResponse.json({ error: 'Solo imágenes permitidas' }, { status: 422 })
    }
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Wrap upload_stream in a promise to await upload
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({ url: (uploadResult as { secure_url: string }).secure_url });

  } catch (error: any) {
    console.error('Upload error:', { message: error?.message });
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
