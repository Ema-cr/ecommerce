'use client';
import { useRouter } from 'next/navigation';

export default function GoDetail({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button onClick={() => router.push(`/detail/${id}`)}>
      Ver detalle
    </button>
  );
}