export async function exportCanvasAsPng(canvasEl, fileName) {
  if (typeof html2canvas !== 'function') {
    alert('html2canvas not loaded — check internet connection.');
    return;
  }
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  const result = await html2canvas(canvasEl, {
    backgroundColor: '#071520',
    scale: 2,
    useCORS: true,
    logging: false
  });
  const dataUrl = result.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${fileName}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
