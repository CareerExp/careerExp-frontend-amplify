# AWS S3 and CloudFront Setup Guide for SPA

## S3 Configuration

1. Make sure your S3 bucket is configured for static website hosting
2. In the bucket properties, enable "Static website hosting"
3. Set both "Index document" and "Error document" to `index.html`
4. Set the appropriate bucket policy for public access

## CloudFront Configuration

1. Create a CloudFront distribution pointing to your S3 bucket's website endpoint
2. Configure the following settings:

   - Origin: Your S3 bucket website endpoint (not the S3 bucket itself)
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Cache Policy: CachingOptimized or create a custom one
   - Function Associations:
     - Add an origin response function to ensure proper routing

3. Create a CloudFront Function with the following code:

```javascript
function handler(event) {
  var response = event.response;
  var request = event.request;

  // Check if the request is for a file with an extension
  var hasExtension = /\/[^/]+\.[^/]+$/.test(request.uri);

  // For requests without file extensions that aren't for existing files,
  // return the index.html to let the SPA router handle it
  if (!hasExtension) {
    response.headers["cache-control"] = {
      value: "no-cache, no-store, must-revalidate",
    };
  }

  return response;
}
```

4. Associate this function with the Origin Response event of your distribution

## Deploy Process

1. Build your project with: `npm run build`
2. Upload the contents of the `dist` folder to your S3 bucket
3. If needed, invalidate your CloudFront cache after deployment

## Important Headers

- Ensure the following headers are set for HTML files:
  - `Cache-Control: no-cache, no-store, must-revalidate`
  - `Pragma: no-cache`
  - `Expires: 0`
- CSS and JS files can be cached normally
