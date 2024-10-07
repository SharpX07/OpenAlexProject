import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink
} from "@/components/ui/pagination";

interface OaPaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const OaPagination: React.FC<OaPaginationProps> = ({ page, setPage }) => {
    return (
        <Pagination>
            <PaginationContent>
                {renderNumberPagination(page, setPage)}
            </PaginationContent>
        </Pagination>
    );
};

const renderNumberPagination = (page: number, setPage: React.Dispatch<React.SetStateAction<number>>) => {
    const totalPages = 100; // Definir el número total de páginas
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        if (i <= 2 || i >= totalPages - 1 || (i >= page - 1 && i <= page + 1)) {
            pageNumbers.push(
                <PaginationItem key={i} className='bg-[#ffffff] border border-[#d5bdaf] rounded-[11px] p-0 m-0'>
                    <PaginationLink href="#" onClick={() => setPage(i)}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        } else if (i === 3 || i === totalPages - 2) {
            pageNumbers.push(<PaginationEllipsis key={i} />);
        }
    }
    return pageNumbers;
};

export default OaPagination;
