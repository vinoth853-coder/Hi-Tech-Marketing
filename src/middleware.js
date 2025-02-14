import { NextResponse } from 'next/server';

const roleRoutes = {
  Accountant: ['/accounts', '/accounts/addFamily', '/updateMass', '/donationHistory'], 
  User: ['/taxDetails', '/profile', '/payTax'], 
  Admin: ['/admin'],
  Father: ['/updateMass']
};

export function middleware(request) {
  const token = request.cookies.get('token')?.value; 
  const pathName = request.nextUrl.pathname;
  const userRoleName = request.cookies.get('role')?.value; 

  const publicRoutes = ['/', '/mass', '/eventspage', '/blog', '/contact', '/specialDays', '/donate'];

  if (publicRoutes.includes(pathName)) {
    return NextResponse.next();
  }

  if ((userRoleName === 'Admin' || userRoleName === 'Accountant' || userRoleName === 'Father') && pathName === '/payTax') {
    return NextResponse.redirect(new URL('/', request.url)); 
  }

  if (!token && pathName !== '/loginPage') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (token && pathName === '/loginPage') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (userRoleName) {
    const allowedRoutes = roleRoutes[userRoleName];
    if (!allowedRoutes || !allowedRoutes.includes(pathName)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/loginPage',
    '/',
    '/mass',
    '/eventspage',
    '/blog',
    '/contact',
    '/donate',
    '/payTax',
    '/accounts',
    '/accounts/addFamily',
    '/taxDetails',
    '/profile',
    '/specialDays',
    '/updateMass',
    '/admin',
    '/donationHistory'
  ],
};
