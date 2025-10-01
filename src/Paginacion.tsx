


interface PaginacionProps {
  totalPages: number;
  currentPage: number;
  goToPage: (page: number) => void;
}
const Paginacion = ({ totalPages, currentPage, goToPage }: PaginacionProps) => {
  if (totalPages <= 1) return null; // no mostrar si solo hay 1 página

  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`btn-small ${currentPage === page ? 'active' : ''}`}
          aria-label={`Ir a la página ${page}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Paginacion;
