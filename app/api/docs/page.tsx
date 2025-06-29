import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">DigiGo Care API Documentation</h1>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <SwaggerUI url="/api/openapi.json" />
      </div>
    </div>
  );
}