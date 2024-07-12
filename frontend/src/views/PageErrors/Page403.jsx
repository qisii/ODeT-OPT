import React from 'react';

function Page403() {
  return (
    <div className="container mx-auto h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">403</h1>
            <p className="text-red-600 text-2xl mb-4">Opps! Forbidden.</p>
            <p className="text-xl mb-8">You do not have admin rights.</p>
            <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Go back to Dashboard
        </a>
      </div>
    </div>
  );
}

export default Page403;
