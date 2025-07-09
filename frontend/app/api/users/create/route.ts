import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, email, username } = body;

    if (!uid || !email ) {
      return NextResponse.json({ error: 'Missing uid, email or username' }, { status: 400 });
    }

    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const userData: any = {
        email,
        uid,
        createdAt: new Date().toISOString(),
        rooms: [],
        notes: [],
      };

      if (username) {
        userData.username = username;
      }

      await setDoc(userRef, userData);

      return NextResponse.json({ created: true, message: 'User added' });
    }


    return NextResponse.json({ created: false, message: 'User already exists' });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
