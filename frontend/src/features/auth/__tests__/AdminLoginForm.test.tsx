import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminLoginForm } from '../components/AdminLoginForm';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

describe('AdminLoginForm', () => {
  const onLoginSuccess = vi.fn();
  const onBackToHome = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders username and password inputs along with submit button', () => {
    render(
      <AdminLoginForm
        onLoginSuccess={onLoginSuccess}
        onBackToHome={onBackToHome}
      />
    );

    expect(screen.getByLabelText(/usuario institucional/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña de seguridad/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /ingresar al panel de gestión/i })
    ).toBeInTheDocument();
  });

  it('displays validation error when submitting with empty fields', async () => {
    render(
      <AdminLoginForm
        onLoginSuccess={onLoginSuccess}
        onBackToHome={onBackToHome}
      />
    );

    fireEvent.submit(screen.getByRole('button', { name: /ingresar al panel de gestión/i }));

    expect(
      screen.getByText('Por favor ingrese su usuario y contraseña institucional.')
    ).toBeInTheDocument();
    expect(authService.login).not.toHaveBeenCalled();
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });

  it('calls onLoginSuccess when credentials are correct and login succeeds', async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      token: 'fake-jwt-token',
      refreshToken: 'fake-refresh-token',
      username: 'admin',
      fullName: 'Admin URP',
      role: 'SuperAdmin',
      expiresAt: '2030-01-01T00:00:00Z',
      refreshExpiresAt: '2030-01-01T00:00:00Z',
    });

    render(
      <AdminLoginForm
        onLoginSuccess={onLoginSuccess}
        onBackToHome={onBackToHome}
      />
    );

    fireEvent.change(screen.getByLabelText(/usuario institucional/i), {
      target: { value: 'admin_famurp' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña de seguridad/i), {
      target: { value: 'Secret123!' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /ingresar al panel de gestión/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        username: 'admin_famurp',
        password: 'Secret123!',
      });
      expect(onLoginSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('displays error message when login fails with invalid credentials', async () => {
    vi.mocked(authService.login).mockRejectedValueOnce(
      new Error('Credenciales inválidas o cuenta inactiva.')
    );

    render(
      <AdminLoginForm
        onLoginSuccess={onLoginSuccess}
        onBackToHome={onBackToHome}
      />
    );

    fireEvent.change(screen.getByLabelText(/usuario institucional/i), {
      target: { value: 'wrong_user' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña de seguridad/i), {
      target: { value: 'wrong_pass' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /ingresar al panel de gestión/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Credenciales inválidas o cuenta inactiva.')
      ).toBeInTheDocument();
      expect(onLoginSuccess).not.toHaveBeenCalled();
    });
  });

  it('calls onBackToHome when clicking return button', () => {
    render(
      <AdminLoginForm
        onLoginSuccess={onLoginSuccess}
        onBackToHome={onBackToHome}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /volver a la biblioteca virtual/i }));
    expect(onBackToHome).toHaveBeenCalledTimes(1);
  });
});
