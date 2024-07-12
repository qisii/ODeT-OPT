import React from 'react';

function Page404() {
  return (
    <div className="container mx-auto h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-red-600 text-2xl mb-4">Opps! Page not found.</p>
        <p className="text-xl mb-8">The page you’re looking for doesn’t exist.</p>
        <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Go Back to Dashboard
        </a>
      </div>
    </div>
  );
}

export default Page404;
