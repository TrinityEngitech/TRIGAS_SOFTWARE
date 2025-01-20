// import html2canvas from "html2canvas";

// export const handleDownloadImage = async (ref) => {
//   try {
//     if (ref.current) {
//       const canvas = await html2canvas(ref.current);
//       const image = canvas.toDataURL("image/png");

//       // Create a temporary link to download the image
//       const link = document.createElement("a");
//       link.href = image;
//       link.download = "pricesheet.png";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       console.log("Image download started successfully.");
//     } else {
//       console.error("No reference found for the provided ref.");
//     }
//   } catch (error) {
//     console.error("Failed to capture and download image:", error);
//   }
// };


import html2canvas from "html2canvas";

export const handleDownloadImage = (sheetRef) => {
  if (sheetRef.current) {
    html2canvas(sheetRef.current, {
      useCORS: true, // Allow cross-origin images
      onclone: (documentClone) => {
        documentClone.fonts.ready.then(() => {
          console.log("Fonts loaded"); // Ensure fonts are loaded
        });
      },
      scale: 2, // Increase scale for higher resolution
    })
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = "pricesheet.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      })
      .catch((error) => {
        console.error("Error capturing the image:", error);
      });
  } else {
    console.error("Sheet reference is not available");
  }
};

