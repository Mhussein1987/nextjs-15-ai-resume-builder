import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function POST(request: NextRequest) {
  try {
    const { html, language = 'en', resumeData } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    console.log('PDF Generation Debug:', {
      hasResumeData: !!resumeData,
      hasPhoto: !!resumeData?.photo,
      photoDataType: resumeData?.photo ? typeof resumeData.photo : 'none',
      photoKeys: resumeData?.photo ? Object.keys(resumeData.photo) : 'none',
      photoName: resumeData?.photo?.name,
      photoSize: resumeData?.photo?.size,
      photoType: resumeData?.photo?.type
    });

    // Convert photo File to base64 if it exists
    let processedHTML = html;
    if (resumeData?.photo) {
      try {
        console.log('Processing photo data...');
        
        // Handle both File objects and serialized File data
        let photoBuffer: Buffer;
        let photoMimeType: string;
        
        if (resumeData.photo instanceof File) {
          // Direct File object
          photoBuffer = Buffer.from(await resumeData.photo.arrayBuffer());
          photoMimeType = resumeData.photo.type;
        } else if (resumeData.photo.data && resumeData.photo.type) {
          // Serialized File data from form
          photoBuffer = Buffer.from(resumeData.photo.data, 'base64');
          photoMimeType = resumeData.photo.type;
        } else if (typeof resumeData.photo === 'string' && resumeData.photo.startsWith('data:')) {
          // Already a data URL
          console.log('Photo is already a data URL');
          const dataUrlRegex = /^data:([^;]+);base64,(.+)$/;
          const match = resumeData.photo.match(dataUrlRegex);
          if (match) {
            photoMimeType = match[1];
            photoBuffer = Buffer.from(match[2], 'base64');
          } else {
            throw new Error('Invalid data URL format');
          }
        } else {
          console.log('Photo data format not recognized:', resumeData.photo);
          throw new Error('Unsupported photo data format');
        }
        
        const photoBase64 = photoBuffer.toString('base64');
        const photoDataUrl = `data:${photoMimeType};base64,${photoBase64}`;
        
        console.log('Photo conversion successful:', {
          mimeType: photoMimeType,
          base64Length: photoBase64.length,
          dataUrlLength: photoDataUrl.length
        });
        
        // Replace blob URLs with base64 data URLs in the HTML
        const blobUrlRegex = /src="blob:https?:\/\/[^"]*"/g;
        const matches = processedHTML.match(blobUrlRegex);
        console.log('Found blob URLs in HTML:', matches?.length || 0);
        
        processedHTML = processedHTML.replace(blobUrlRegex, `src="${photoDataUrl}"`);
        
        // Also replace any Next.js Image component src attributes that contain blob URLs
        const nextImageRegex = /src="[^"]*"/g;
        processedHTML = processedHTML.replace(nextImageRegex, (match: string) => {
          if (match.includes('blob:')) {
            return `src="${photoDataUrl}"`;
          }
          return match;
        });
        
        console.log('HTML processing complete');
      } catch (error) {
        console.error('Error converting photo to base64:', error);
      }
    } else {
      console.log('No photo data found in resumeData');
    }

    // Launch browser with optimized settings for perfect fidelity
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--enable-font-antialiasing',
        '--force-color-profile=srgb',
        '--force-device-scale-factor=2',
        '--high-dpi-support=1',
        '--print-to-pdf-no-header',
        '--print-to-pdf-no-footer',
        '--disable-web-security',
        '--allow-running-insecure-content',
        '--disable-features=VizDisplayCompositor',
        '--font-render-hinting=none',
        '--disable-lcd-text',
        '--disable-gpu-rasterization'
      ]
    });

    const context = await browser.newContext({
      viewport: {
        width: 1240, // Wider viewport to capture content properly before scaling to A4
        height: 1754, // A4 height in pixels at 150 DPI for better quality
      },
      deviceScaleFactor: 1.5, // Higher scale factor for better quality, will be scaled back in PDF
      colorScheme: 'light',
      locale: language === 'ar' ? 'ar-SA' : 'en-US',
      timezoneId: 'UTC',
    });

    const page = await context.newPage();

    // Set extra HTTP headers for better font loading
    await page.setExtraHTTPHeaders({
      'Accept-Language': language === 'ar' ? 'ar-SA,ar;q=0.9' : 'en-US,en;q=0.9',
    });

    // Create a complete HTML document with all necessary styles
    const completeHTML = `
      <!DOCTYPE html>
      <html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume PDF</title>
        
        <!-- Include Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        
        <!-- Include Inter font for English -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        
        <!-- Include Arabic fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet">
        
        <style>
          /* Base styles for perfect PDF rendering */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box;
          }
          
          body, html {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
            background: white;
            color: #1f2937;
          }
          
          /* Arabic font support */
          [dir="rtl"] {
            font-family: 'Cairo', 'Tajawal', 'Inter', sans-serif;
          }
          
          /* Ensure all backgrounds are preserved */
          [style*="background"], [class*="bg-"] {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Preserve gradients */
          [style*="linear-gradient"], [style*="radial-gradient"] {
            background-attachment: local !important;
          }
          
          /* Ensure proper text alignment for RTL */
          [dir="rtl"] * {
            text-align: right !important;
            direction: rtl !important;
          }
          
          /* Preserve box shadows and borders */
          [style*="box-shadow"], [class*="shadow"] {
            box-shadow: inherit !important;
          }
          
          /* Ensure images render at full quality */
          img {
            image-rendering: -webkit-optimize-contrast !important;
            image-rendering: crisp-edges !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
          }
          
          /* A4 page optimization - ensure exact A4 dimensions */
          body {
            width: 210mm !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            background: white !important;
          }
          
          /* Target the main resume container */
          body > div {
            width: 210mm !important;
            max-width: 210mm !important;
            min-height: 297mm !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            transform: none !important;
            zoom: 1 !important;
            scale: 1 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
          }
          
          /* A4 pages within resume container */
          .a4-page {
            width: 210mm !important;
            min-height: 297mm !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
            background: white !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
            display: block !important;
            position: relative !important;
            transform: none !important;
            zoom: 1 !important;
            scale: 1 !important;
          }
          
          .a4-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          
          /* Ensure proper content padding within A4 pages */
          .a4-page > div {
            width: 100% !important;
            height: auto !important;
            padding: 15mm !important;
            box-sizing: border-box !important;
            margin: 0 !important;
          }
          
          /* Hide any background containers or UI elements that shouldn't be in PDF */
          .no-print, .print-button, .pdf-button, .floating-pdf-button, 
          .bg-\\[\\#f3f4f6\\], .bg-gray-200, .dark\\:bg-gray-800 {
            display: none !important;
          }
          
          /* Force specific resume template containers to be exactly A4 */
          [class*="bg-[#f3f4f6]"], [style*="background.*#f3f4f6"],
          [class*="bg-gray-200"], [style*="background.*gray"] {
            background: white !important;
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Force exact font weights */
          .font-bold { font-weight: 700 !important; }
          .font-semibold { font-weight: 600 !important; }
          .font-medium { font-weight: 500 !important; }
          .font-normal { font-weight: 400 !important; }
          .font-light { font-weight: 300 !important; }
          
          /* Force exact text sizes */
          .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
          .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
          .text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
          .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
          .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
          .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
          
          /* Force exact colors */
          .text-slate-800 { color: #1e293b !important; }
          .text-slate-600 { color: #475569 !important; }
          .text-slate-500 { color: #64748b !important; }
          .text-white { color: #ffffff !important; }
          .text-gray-500 { color: #6b7280 !important; }
          
          /* Force exact backgrounds */
          .bg-white { background-color: #ffffff !important; }
          .bg-slate-50 { background-color: #f8fafc !important; }
          
          /* Force exact spacing */
          .p-3 { padding: 0.75rem !important; }
          .p-6 { padding: 1.5rem !important; }
          .pt-8 { padding-top: 2rem !important; }
          .mb-1 { margin-bottom: 0.25rem !important; }
          .mb-2 { margin-bottom: 0.5rem !important; }
          .mb-3 { margin-bottom: 0.75rem !important; }
          .mb-4 { margin-bottom: 1rem !important; }
          .mb-6 { margin-bottom: 1.5rem !important; }
          .mt-2 { margin-top: 0.5rem !important; }
          .gap-2 { gap: 0.5rem !important; }
          .gap-3 { gap: 0.75rem !important; }
          
          /* Force exact flex properties */
          .flex { display: flex !important; }
          .flex-col { flex-direction: column !important; }
          .items-center { align-items: center !important; }
          .items-start { align-items: flex-start !important; }
          .justify-between { justify-content: space-between !important; }
          .flex-1 { flex: 1 1 0% !important; }
          .flex-shrink-0 { flex-shrink: 0 !important; }
          
          /* Force exact grid properties */
          .grid { display: grid !important; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          
          /* Force exact positioning */
          .relative { position: relative !important; }
          .absolute { position: absolute !important; }
          
          /* Force exact borders and shadows */
          .border { border-width: 1px !important; }
          .border-gray-100 { border-color: #f3f4f6 !important; }
          .border-white { border-color: #ffffff !important; }
          .rounded-lg { border-radius: 0.5rem !important; }
          .rounded-xl { border-radius: 0.75rem !important; }
          .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important; }
          
          /* Force exact widths */
          .w-1 { width: 0.25rem !important; }
          .w-2 { width: 0.5rem !important; }
          .w-6 { width: 1.5rem !important; }
          .w-1\/3 { width: 33.333333% !important; }
          .w-2\/3 { width: 66.666667% !important; }
          
          /* Force exact heights */
          .h-1 { height: 0.25rem !important; }
          .h-6 { height: 1.5rem !important; }
          .h-px { height: 1px !important; }
          
          /* Force exact text alignment */
          .text-center { text-align: center !important; }
          .text-left { text-align: left !important; }
          .text-right { text-align: right !important; }
          
          /* Force exact whitespace */
          .whitespace-pre-line { white-space: pre-line !important; }
          .whitespace-nowrap { white-space: nowrap !important; }
          
          /* Force exact leading */
          .leading-tight { line-height: 1.25 !important; }
          .leading-relaxed { line-height: 1.625 !important; }
          
          /* Force exact opacity */
          .text-white\\/90 { color: rgba(255, 255, 255, 0.9) !important; }
          .text-white\\/80 { color: rgba(255, 255, 255, 0.8) !important; }
          .bg-white\\/15 { background-color: rgba(255, 255, 255, 0.15) !important; }
          .bg-white\\/25 { background-color: rgba(255, 255, 255, 0.25) !important; }
          .border-white\\/20 { border-color: rgba(255, 255, 255, 0.2) !important; }
          
          /* Force exact backdrop blur */
          .backdrop-blur-sm { backdrop-filter: blur(4px) !important; }
          
          /* Force exact transitions */
          .transition-all { transition-property: all !important; }
          .duration-300 { transition-duration: 300ms !important; }
          
          /* Force exact hover states for PDF */
          .hover\\:shadow-md:hover { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06) !important; }
          .hover\\:bg-white\\/25:hover { background-color: rgba(255, 255, 255, 0.25) !important; }
          .hover\\:border-gray-200:hover { border-color: #e5e7eb !important; }
          .group-hover\\:border-gray-200 { border-color: #e5e7eb !important; }
          
          /* Force exact gradients */
          .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)) !important; }
          .bg-gradient-to-b { background-image: linear-gradient(to bottom, var(--tw-gradient-stops)) !important; }
          .from-gray-300 { --tw-gradient-from: #d1d5db !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgb(209 213 219 / 0)) !important; }
          .to-transparent { --tw-gradient-to: transparent !important; }
          .from-gray-200 { --tw-gradient-from: #e5e7eb !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgb(229 231 235 / 0)) !important; }
          
          /* Force exact spacing utilities */
          .space-y-3 > * + * { margin-top: 0.75rem !important; }
          .space-y-6 > * + * { margin-top: 1.5rem !important; }
          
          /* Force exact last child utilities */
          .last\\:mb-0:last-child { margin-bottom: 0 !important; }
          
          /* Force exact group utilities */
          .group { position: relative !important; }
          
          /* Force exact animation utilities */
          .animate-slide-in { animation: slideIn 0.5s ease-out !important; }
          
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
      </head>
      <body>
        ${processedHTML}
      </body>
      </html>
    `;

    // Set content with enhanced styling for perfect fidelity
    await page.setContent(completeHTML, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for fonts and images to load completely
    await page.waitForTimeout(5000);

    // Ensure all content is properly sized for A4
    await page.evaluate(() => {
      // Remove any scaling or transforms that might interfere with A4 sizing
      const elementsWithTransform = document.querySelectorAll('[style*="transform"], [style*="scale"], [style*="zoom"]');
      elementsWithTransform.forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.transform = 'none';
        htmlEl.style.zoom = '1';
        if (htmlEl.style.scale) htmlEl.style.scale = '1';
      });

      // Force main container to be exactly A4
      const body = document.body;
      body.style.width = '210mm';
      body.style.height = 'auto';
      body.style.minHeight = '297mm';
      body.style.margin = '0';
      body.style.padding = '0';
      body.style.backgroundColor = 'white';
      body.style.overflow = 'visible';

      // Force all child elements of body to fit within A4
      Array.from(body.children).forEach(child => {
        const htmlChild = child as HTMLElement;
        htmlChild.style.width = '210mm';
        htmlChild.style.maxWidth = '210mm';
        htmlChild.style.margin = '0';
        htmlChild.style.backgroundColor = 'white';
        htmlChild.style.transform = 'none';
        htmlChild.style.zoom = '1';
        if (htmlChild.style.scale) htmlChild.style.scale = '1';
      });

      console.log('A4 sizing enforced on page elements');
    });

    // Debug: Check final page dimensions
    const pageDimensions = await page.evaluate(() => {
      return {
        bodyWidth: document.body.offsetWidth,
        bodyHeight: document.body.offsetHeight,
        firstChildWidth: document.body.firstElementChild?.clientWidth,
        firstChildHeight: document.body.firstElementChild?.clientHeight,
        scrollWidth: document.body.scrollWidth,
        scrollHeight: document.body.scrollHeight
      };
    });

    console.log('Page dimensions after A4 enforcement:', pageDimensions);

    // Debug: Check if images are loaded
    const imageCount = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      console.log('Images found in page:', images.length);
      images.forEach((img, index) => {
        console.log(`Image ${index}:`, {
          src: img.src,
          width: img.width,
          height: img.height,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete
        });
      });
      return images.length;
    });

    console.log('Total images found:', imageCount);

    // Generate PDF with perfect A4 fidelity settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm', 
        bottom: '0mm',
        left: '0mm'
      },
      preferCSSPageSize: true, // Use CSS page dimensions
      displayHeaderFooter: false,
      scale: 1.0, // Exact scale for perfect fidelity
      width: '210mm', // Force exact A4 width
      height: '297mm', // Force exact A4 height
    });

    await browser.close();

    console.log('PDF generation completed successfully');

    // Return PDF as blob with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume_${new Date().getTime()}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
} 