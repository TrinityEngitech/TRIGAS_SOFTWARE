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
