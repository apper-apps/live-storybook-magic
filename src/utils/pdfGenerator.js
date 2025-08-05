import jsPDF from "jspdf";

export const generateStoryPDF = async (story, illustrations, title = "My Story") => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = pageHeight - (margin * 2);

    // Title page
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(title, contentWidth);
    const titleHeight = titleLines.length * 10;
    const titleY = (pageHeight - titleHeight) / 2;
    
    doc.text(titleLines, margin, titleY);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Created with StoryBook Magic", margin, pageHeight - 30);

    // Split story into pages
    const storyParagraphs = story.split("\n\n").filter(p => p.trim());
    const maxParagraphsPerPage = 2;
    
    for (let i = 0; i < storyParagraphs.length; i += maxParagraphsPerPage) {
      doc.addPage();
      
      let currentY = margin;
      
      // Add illustration if available
      if (illustrations[Math.floor(i / maxParagraphsPerPage)] && illustrations[Math.floor(i / maxParagraphsPerPage)].image_url) {
        try {
          const illustration = illustrations[Math.floor(i / maxParagraphsPerPage)];
          const imgData = await loadImageAsBase64(illustration.image_url);
          
          if (imgData) {
            const imgWidth = contentWidth * 0.8;
            const imgHeight = imgWidth * 0.75; // Maintain aspect ratio
            const imgX = (pageWidth - imgWidth) / 2;
            
            doc.addImage(imgData, "JPEG", imgX, currentY, imgWidth, imgHeight);
            currentY += imgHeight + 10;
            
            // Add caption
            if (illustration.caption) {
              doc.setFontSize(10);
              doc.setFont("helvetica", "italic");
              const captionLines = doc.splitTextToSize(illustration.caption, contentWidth);
              doc.text(captionLines, margin, currentY);
              currentY += captionLines.length * 4 + 10;
            }
          }
        } catch (error) {
          console.warn("Failed to add illustration to PDF:", error);
        }
      }
      
      // Add story text
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      
      const pageEndParagraphs = storyParagraphs.slice(i, i + maxParagraphsPerPage);
      
      for (const paragraph of pageEndParagraphs) {
        if (currentY > pageHeight - 40) break; // Leave space at bottom
        
        const lines = doc.splitTextToSize(paragraph, contentWidth);
        const textHeight = lines.length * 6;
        
        if (currentY + textHeight > pageHeight - 40) break;
        
        doc.text(lines, margin, currentY);
        currentY += textHeight + 8;
      }
    }

    return doc;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
};

const loadImageAsBase64 = (url) => {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          
          const dataURL = canvas.toDataURL("image/jpeg", 0.8);
          resolve(dataURL);
        } catch (error) {
          console.warn("Failed to convert image to base64:", error);
          resolve(null);
        }
      };
      
      img.onerror = () => {
        console.warn("Failed to load image:", url);
        resolve(null);
      };
      
      img.src = url;
    } catch (error) {
      console.warn("Error loading image:", error);
      resolve(null);
    }
  });
};

export const downloadPDF = (doc, filename = "my-story.pdf") => {
  try {
    doc.save(filename);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw new Error("Failed to download PDF");
  }
};