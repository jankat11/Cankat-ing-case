/* 

In pagination, the distribution of the page numbers is arranged to appear at the beginning, 
middle, and end based on the total number of pages. 

'Delta' represents the number of pages displayed to the left and right of the middle page. 

For now, I set it to 1, but I will modify this part if I design a better pagination algorithm.

*/

export function getPagesList(currentPage, totalPages, maxVisiblePages = 5) {
  const pages = [];

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  const delta = 1;
  let start = currentPage - delta;
  let end = currentPage + delta;

  if (start < 2) {
    start = 2;
  }

  if (end > totalPages - 1) {
    end = totalPages - 1;
  }

  if (start > 2) {
    pages.push("...");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

