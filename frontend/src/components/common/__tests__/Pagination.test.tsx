import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('renders nothing when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        totalItems={5}
        itemsPerPage={10}
        onPageChange={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders range and total count text correctly', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={4}
        totalItems={35}
        itemsPerPage={10}
        itemName="recursos"
        onPageChange={vi.fn()}
      />
    );
    expect(screen.getByText('Mostrando 11 - 20 de 35 recursos')).toBeInTheDocument();
    expect(screen.getByText('2 / 4')).toBeInTheDocument();
  });

  it('disables previous button on first page and enables next button', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        totalItems={30}
        itemsPerPage={10}
        onPageChange={vi.fn()}
      />
    );
    const prevButton = screen.getByRole('button', { name: 'Anterior' });
    const nextButton = screen.getByRole('button', { name: 'Siguiente' });

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('disables next button on last page and enables previous button', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={3}
        totalItems={30}
        itemsPerPage={10}
        onPageChange={vi.fn()}
      />
    );
    const prevButton = screen.getByRole('button', { name: 'Anterior' });
    const nextButton = screen.getByRole('button', { name: 'Siguiente' });

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('invokes onPageChange when clicking next and previous buttons', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        totalItems={30}
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(handlePageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });
});
