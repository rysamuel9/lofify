// middleware edge
import { NextResponse } from 'next/server';

const signedinPages = ['/', '/playlist', '/library'];

export default function middleware(req) {
  if (signedinPages.find((p) => p === req.nextUrl.pathname)) {
    const token = req.cookies.LOFIFY_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.redirect('/signin');
    }
  }
}
