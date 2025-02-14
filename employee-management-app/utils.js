// Basit bir yardımcı fonksiyon: Gösterilecek sayfa numaralarını hesaplar.
export function getPagesList(currentPage, totalPages, maxVisiblePages = 5) {
  // Örnek: maxVisiblePages = 5
  // 1 (ilk sayfa), 2, 3, 4, 5, ... (son sayfa) gibi.

  const pages = [];

  // Eğer toplam sayfa sayısı, maksimum gösterilecek sayfa sayısından küçükse,
  // hepsini direkt göster.
  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // 1) Her zaman ilk sayfayı ekle
  pages.push(1);

  // 2) Ortada gösterilecek sayfa aralığını hesapla
  // currentPage etrafında kaç sayfa gösterileceğini siz belirleyebilirsiniz.
  // Örneğin 2 solda, 2 sağda (toplam 5).
  const delta = 1; // currentPage'in sol ve sağında kaç sayfa göstereceğiz
  let start = currentPage - delta;
  let end = currentPage + delta;

  // start en az 2 olabilir (çünkü 1 zaten ekli)
  if (start < 2) {
    start = 2;
  }
  // end, totalPages - 1'i geçmesin (çünkü son sayfa en sonda ekleniyor)
  if (end > totalPages - 1) {
    end = totalPages - 1;
  }

  // 3) Eğer start > 2 ise (yani 2 ile start arasında boşluk varsa),
  // "..." ekle
  if (start > 2) {
    pages.push("...");
  }

  // 4) start ile end arasındaki sayfaları ekle
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // 5) Eğer end < totalPages - 1 ise, "..." ekle
  if (end < totalPages - 1) {
    pages.push("...");
  }

  // 6) Her zaman son sayfayı ekle
  pages.push(totalPages);

  return pages;
}