// Importamos herramientas de RTL
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Creamos un mock manual del router
const push = jest.fn();

// Sobrescribimos useRouter para este test
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

// Importamos el componente
import GoDetail from '@/components/godetail/GoDetail';

describe('GoDetail (integración + router)', () => {
  it('llama a router.push con la ruta correcta', async () => {
    const user = userEvent.setup();

    // Renderizamos el componente con id=42
    render(<GoDetail id="42" />);

    // usuario hace clic en "Ver detalle"
    await user.click(screen.getByRole('button', { name: /ver detalle/i }));

    // verificamos que router.push fue llamado correctamente
    expect(push).toHaveBeenCalledWith('/detail/42');
  });
});